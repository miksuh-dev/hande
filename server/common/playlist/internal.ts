/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Readable } from "stream";
import { DateTime } from "luxon";
import { sendErrorMessage, sendMessage } from "@server/router/room/message";
import { MessageType } from "@server/router/room/types";
import { PlayingSong, PlayState, Server } from "@server/types/app";
import { Song } from "@server/types/prisma";
import { SongType } from "@server/types/source";
import {
  NonActiveItem,
  ProcessQueueItem,
  ProcessQueueItemStatus,
} from "./types";
import { AUTOPLAY_SONG_COUNT } from "../../constants";
import ee from "../../eventEmitter";
import prisma from "../../prisma";
import { getRandomSong } from "../../prisma/query";
import { OnlineUser } from "../../types/auth";
import client from "../mumble";
import { createStream as createRadioStream } from "../radio";
import * as room from "../room";
import {
  createStream as createYoutubeStream,
  getVideoInfo,
  guessSongArtistAndTrack,
} from "../youtube-dl";

const MAX_RETRIES = 3;

const processingQueue = new Array<ProcessQueueItem>();
let stream: Readable | undefined;
let endTimeout: NodeJS.Timeout | undefined;

const processQueue = async (caller: ProcessQueueItem) => {
  if (processingQueue.length === 0) return;

  const current = processingQueue.at(0);
  if (!current) return;

  if (current.song.id !== caller.song.id) return;

  await current.callback();

  // Clear rest of the queue as we have decided next song
  processingQueue.splice(1);
};

export const addSongToQueue = async ({ song }: NonActiveItem) => {
  const item: ProcessQueueItem = {
    status: ProcessQueueItemStatus.pending,
    song,
    retryCount: 0,
    callback: async function () {
      try {
        await playSong.call(this);
      } catch (e) {
        if (e instanceof Error) {
          this.status = ProcessQueueItemStatus.error;

          void onSongError.call(this, e.message);
        }
      }
    },
  };

  processingQueue.push(item);

  await processQueue(item);
};

export const removeSongFromQueue = async (song: Song<Server>) => {
  await handleAutoplay();

  return processingQueue.find((item, index) => {
    if (item.song.id === song.id) {
      processingQueue.splice(index, 1);

      return true;
    }

    return false;
  });
};

const onSongEnd = async (song: Song<Server>) => {
  await prisma.song.update({
    where: {
      id: song.id,
    },
    data: {
      ended: true,
    },
  });

  sendMessage(`event.source.${song.type}.end`, { item: [song] });

  await stopCurrentSong();

  ee.emit(`onUpdate`, { song: { remove: [song.id] } });

  await removeSongFromQueue(song);

  const nextSong = await getNextSong();
  if (nextSong) {
    await addSongToQueue(nextSong);
  }
};

async function onSongError(this: ProcessQueueItem, error: string) {
  try {
    stopStream();

    if (this.retryCount <= MAX_RETRIES) {
      sendErrorMessage(
        this.retryCount === MAX_RETRIES ? "event.error" : "event.retry",
        {
          item: [this.song],
          error,
        }
      );
    }

    if (this.retryCount > MAX_RETRIES) {
      this.status = ProcessQueueItemStatus.skipped;
      await onSongEnd(this.song);

      return;
    }

    this.retryCount += 1;

    setTimeout(() => {
      void processQueue(this);
    }, 5000);
  } catch (e) {
    console.log("e", e);
  }
}

const createStream = async (song: Song<Server>) => {
  // Make sure we stop any previous streams
  stopStream();

  if (song.type === SongType.SONG) {
    return createYoutubeStream(song);
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (song.type === SongType.RADIO) {
    return await createRadioStream(song);
  }

  throw new Error("Unknown song type");
};

export const getSongRating = async (contentId: string) => {
  const rating = await prisma.songRating.aggregate({
    where: {
      contentId,
    },
    _sum: {
      vote: true,
    },
  });

  return rating._sum.vote ?? 0;
};

export const getSongOriginalRequester = async (song: Song<Server>) => {
  if (song.type !== SongType.SONG) return undefined;
  if (!song.random) return undefined;

  return prisma.song
    .findFirst({
      where: {
        contentId: song.contentId,
      },
      orderBy: {
        createdAt: "asc",
      },
    })
    .then((result) => result?.requester);
};

export const getSongSettings = async (contentId: string) => {
  return (
    (await prisma.songSettings.findFirst({
      where: {
        contentId: contentId,
      },
    })) ?? {
      contentId: contentId,
      volume: 50,
    }
  );
};

async function onPlayStart(this: ProcessQueueItem) {
  try {
    this.status = ProcessQueueItemStatus.processing;

    if (this.status !== ProcessQueueItemStatus.processing) {
      throw new Error("Failed to update song status");
    }

    this.song.state = PlayState.PLAYING;

    sendMessage(`event.source.${this.song.type}.start`, {
      item: [this.song],
    });

    if (this.song.type === SongType.SONG) {
      const videoInfo = await getVideoInfo(this.song);
      if (!videoInfo) {
        throw new Error("Failed to get video info");
      }

      const startedAt = DateTime.utc();

      this.song.startedAt = startedAt.toISO();

      this.song.duration = videoInfo.duration;

      const { artist, track } = guessSongArtistAndTrack(videoInfo);
      this.song.artist = artist;
      this.song.track = track;

      const secondsLeft = startedAt
        .plus({ seconds: videoInfo.duration })
        .diffNow("seconds").seconds;

      if (endTimeout) clearTimeout(endTimeout);

      endTimeout = setTimeout(() => {
        onSongEnd(this.song).catch((e) => {
          console.log("e", e);
        });
      }, secondsLeft * 1000);

      const [originalRequester] = await Promise.all([
        getSongOriginalRequester(this.song),
        prisma.song.updateMany({
          where: {
            contentId: this.song.contentId,
            duration: null,
          },
          data: {
            duration: videoInfo.duration,
          },
        }),
      ]);

      if (originalRequester) {
        this.song.originalRequester = originalRequester;
      }
    } else {
      this.song.startedAt = DateTime.utc().toISO();
    }

    await prisma.song.update({
      where: {
        id: this.song.id,
      },
      data: {
        started: true,
      },
    });

    const index = processingQueue.findIndex(
      (item) => item.song.id === this.song.id
    );

    if (index === -1) {
      throw new Error("Failed to find song in queue");
    }

    processingQueue[index] = this;

    ee.emit(`onUpdate`, {
      song: { setPlaying: this.song },
    });
  } catch (e) {
    if (e instanceof Error) {
      void onSongError.call(this, e.message);
    }
  }
}

async function playSong(this: ProcessQueueItem) {
  try {
    stream = await createStream(this.song);

    let started = false;
    stream.on("data", () => {
      if (!started) {
        started = true;

        setVolume(this.song.volume);

        onPlayStart.call(this).catch((e) => {
          console.log("e", e);
        });
      }
    });

    stream.on("error", (e) => {
      if (e instanceof Error) {
        void onSongError.call(this, e.message);
      }
    });

    client.voiceConnection
      .playStream(stream, "0")
      .on("error", (message: string) => {
        void onSongError.call(this, message);
      });
  } catch (e) {
    if (e instanceof Error) {
      void onSongError.call(this, e.message);
    }
  }
}

export const getCurrentSong = (): PlayingSong<Server> | undefined => {
  const item = processingQueue.at(0);

  if (!item || item.status !== ProcessQueueItemStatus.processing) {
    return undefined;
  }

  return item.song;
};

const stopStream = () => {
  client.voiceConnection.stopStream();

  if (endTimeout) {
    clearTimeout(endTimeout);
  }

  if (stream) {
    stream.destroy();
    stream = undefined;
  }
};

export const getNextSong = async (): Promise<NonActiveItem | null> => {
  const song = (await prisma.song.findFirst({
    where: {
      ended: false,
      skipped: false,
    },
    orderBy: [
      {
        position: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  })) as Song<Server> | null;

  if (!song) return null;

  const [rating, options, originalRequester] = await Promise.all([
    getSongRating(song.contentId),
    getSongSettings(song.contentId),
    getSongOriginalRequester(song),
  ]);

  return {
    status: ProcessQueueItemStatus.pending,
    song: {
      ...song,
      rating,
      volume: options.volume,
      startedAt: null,
      ...(song.type === SongType.SONG && { originalRequester }),
    },
  };
};

export const getPlaylist = async () => {
  return (await prisma.song.findMany({
    where: {
      ended: false,
      skipped: false,
      id: { not: getCurrentSong()?.id },
    },
    orderBy: [
      {
        position: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  })) as Song<Server>[];
};

export const stopCurrentSong = async () => {
  stopStream();

  const nextSong = await getNextSong();
  const state = nextSong
    ? { ...nextSong.song, state: PlayState.STARTING }
    : undefined;

  ee.emit(`onUpdate`, {
    song: { setPlaying: state },
  });
};

export const setVolume = (volume: number) => {
  // 50 -> 0.5
  client.voiceConnection.setVolume(volume / 100);
};

export const addRandomSong = async (
  requester: OnlineUser,
  source: "user" | "autoplay" = "user"
) => {
  const song = await getRandomSong();

  const addedSong = await prisma.$transaction(async (transaction) => {
    const lastSong = await transaction.song.findFirst({
      where: {
        ended: false,
        skipped: false,
      },
      orderBy: [
        {
          position: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    const position = lastSong ? lastSong.position + 1 : 0;
    return {
      ...(await transaction.song.create({
        data: {
          url: song.url,
          contentId: song.contentId,
          title: song.title,
          thumbnail: song.thumbnail,
          requester: requester.name,
          type: song.type,
          position,
          ended: false,
          skipped: false,
          random: true,
        },
      })),
      originalRequester: song.requester,
    } as Song<Server, SongType.SONG>;
  });

  sendMessage(
    source === "user"
      ? "event.common.addedRandom"
      : "event.common.addedRandomAutoplay",
    {
      user: requester,
      type: MessageType.ACTION,
      item: [addedSong],
    }
  );

  ee.emit(`onUpdate`, { song: { add: [addedSong] } });

  return addedSong;
};

export const handleAutoplay = async () => {
  const autoplay = room.get().autoplay;
  if (!autoplay) return;

  if (room.hasAutoplayExpired()) {
    room.onAutoplayExpire();

    return;
  }

  const playlist = await getPlaylist();

  const songsInQueue = playlist.length;
  for (let i = songsInQueue; i < AUTOPLAY_SONG_COUNT; i++) {
    await addRandomSong(autoplay.requester, "autoplay");
  }
};
