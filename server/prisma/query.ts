import { MAX_SONG_DURATION_FOR_RANDOM_SONG } from "@server/constants";
import { RandomSongStatistics, Server } from "@server/types/app";
import { Song } from "@server/types/prisma";
import { SongType } from "@server/types/source";
import prisma from "./";

type RandomSong = {
  contentId: string;
  playCount: number;
  skipCount: number;
  rating: number;
};

const wilsonLower = (trials: number, successes: number) => {
  const z = 1.96;

  const p = successes / trials;
  const denominator = 1 + z ** 2 / trials;
  const centerAdjustedPropability = p + z ** 2 / (2 * trials);
  const adjustedStandardDeviation =
    ((p * (1 - p) + z ** 2 / (4 * trials)) / trials) ** 0.5;

  return (
    (centerAdjustedPropability - z * adjustedStandardDeviation) / denominator
  );
};

const getSkipProbability = (song: RandomSong) => {
  const { playCount, skipCount, rating } = song;
  const lower = wilsonLower(playCount, skipCount);

  const ratingFactor = rating * 0.1;

  return Math.max(0, lower - ratingFactor);
};

const getRandomSongStatistics = (song: RandomSong): RandomSongStatistics => ({
  rating: song.rating,
  playCount: song.playCount,
  skipCount: song.skipCount,
  skipProbability: getSkipProbability(song),
});

export const getRandomSong = async (minimumRandomIndex: number) => {
  const rows: {
    contentId: string;
    playCount: bigint;
    skipCount: bigint;
    rating: bigint;
  }[] = await prisma.$queryRaw`
      SELECT
          so.title,
          so.contentId,
          count(so.contentId) as playCount,
          SUM(so.skipped) as skipCount,
          rp.count as randomIndex,
          COALESCE(sr.song_votes, 0) as rating
      FROM
          RandomPlaylist rp
      LEFT JOIN (
        SELECT contentId, SUM(vote) AS song_votes FROM SongRating GROUP BY contentId
      ) sr ON sr.contentId = rp.contentId
      LEFT JOIN Song so
        ON so.contentId = rp.contentId
      WHERE
          COALESCE(sr.song_votes, 0) >= 0
          AND rp.count = ${minimumRandomIndex}
          AND so.type = 'song'
          AND (so.duration >= ${MAX_SONG_DURATION_FOR_RANDOM_SONG} OR so.duration IS NULL)
      GROUP BY
          so.contentId
      ORDER BY
          RANDOM()
      LIMIT 10
  `;

  const trialRows = rows.map((row) => ({
    contentId: row.contentId,
    playCount: Number(row.playCount),
    skipCount: Number(row.skipCount),
    rating: Number(row.rating),
  }));

  if (!rows.length) {
    throw new Error("No songs found");
  }

  const foundIndex = trialRows.findIndex((randomSong, index) => {
    if (Math.random() > getSkipProbability(randomSong)) {
      return true;
    }

    // Fall back to the last song
    if (index === rows.length - 1) {
      return true;
    }
  });

  const pickedSong = trialRows[foundIndex];

  if (!pickedSong) {
    throw new Error("No songs found");
  }

  const skippedContentIds = trialRows
    .slice(0, foundIndex)
    .map(({ contentId }) => contentId);

  if (skippedContentIds.length) {
    await prisma.randomPlaylist.updateMany({
      where: {
        contentId: {
          in: skippedContentIds,
        },
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });
  }

  const song = (await prisma.song.findFirstOrThrow({
    where: {
      type: SongType.SONG,
      contentId: pickedSong.contentId,
    },
  })) as Song<Server, SongType.SONG>;

  return {
    song,
    randomStatistics: getRandomSongStatistics(pickedSong),
  };
};

export const getMinimumRandomIndex = async () => {
  const [row]: {
    count: bigint;
  }[] = await prisma.$queryRaw`
      SELECT COALESCE(min(rp.count), 0) as count
      from RandomPlaylist rp
      LEFT JOIN (
        SELECT contentId, SUM(vote) AS song_votes FROM SongRating GROUP BY contentId
      ) sr ON sr.contentId = rp.contentId
      LEFT JOIN Song so ON so.contentId = rp.contentId
      WHERE
        COALESCE(sr.song_votes, 0) >= 0
        AND so.type = 'song'
        AND (so.duration >= ${MAX_SONG_DURATION_FOR_RANDOM_SONG} OR so.duration IS NULL)
    `;

  return Number(row?.count) ?? 0;
};

export const updateRandomIndex = async (
  contentId: string,
  minimumRandomIndex: number
) => {
  return prisma.randomPlaylist.upsert({
    where: {
      contentId,
    },
    update: {
      count: {
        increment: 1,
      },
    },
    create: {
      contentId,
      count: minimumRandomIndex + 1,
    },
  });
};
