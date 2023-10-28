import prisma from "./";
import { SourceType } from "../types/source";

export const getRandomSong = async () => {
  const [row]: { contentId: string; random_weight: string }[] =
    await prisma.$queryRaw`
      WITH SongVotes AS (
        SELECT
          s.contentId as contentId,
          s.title AS song_title,
          coalesce(ra.song_votes+1, 1) * 1.0 as song_rating,
          sum(ra.song_votes) OVER() * 1.0  as total_ratings,
          count(s.contentId) OVER() * 1.0  as total_songs
        FROM
          Song s
        LEFT JOIN (select ra.contentId, sum(ra.vote) as song_votes from SongRating ra Group by contentId) ra on ra.contentId = s.contentId
        WHERE s.type = 'song'
        GROUP BY
          s.contentId
      )
      SELECT
        contentId,
        CASE
          WHEN total_songs = 0 THEN 0
          ELSE  RANDOM() * (1 + (song_rating / (total_songs)))
        END AS random_weight
      FROM
        SongVotes
      WHERE song_rating >= 0
      ORDER BY
        random_weight desc
      LIMIT 1
  `;

  if (!row) {
    throw new Error("No songs found");
  }
  const { contentId } = row;

  return prisma.song.findFirstOrThrow({
    where: {
      type: SourceType.SONG,
      contentId,
    },
  });
};
