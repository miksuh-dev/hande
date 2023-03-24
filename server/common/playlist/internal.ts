/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Readable } from "stream";
import { Song } from "@prisma/client";
import { DateTime } from "luxon";
import { PlayingSong } from "types/app";
import ee from "../../eventEmitter";
import prisma from "../../prisma";
import { sendErrorMessage, sendMessage } from "../../router/room/message";
import { SourceType } from "../../router/room/sources";
import client from "../mumble";
import { createStream as createRadioStream } from "../radio";
import {
  createStream as createYoutubeStream,
  getVideoInfo,
} from "../youtube-dl";
import { ProcessQueueItem, ProcessQueueItemStatus } from "./types";

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

export const addSongToQueue = async (song: Song) => {
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

export const removeSongFromQueue = (song: Song) => {
  processingQueue.forEach((item, index) => {
    if (item.song.id === song.id) {
      processingQueue.splice(index, 1);
    }
  });
};

export const onSongEnd = async (song: Song) => {
  await prisma.song.update({
    where: {
      id: song.id,
    },
    data: {
      ended: true,
    },
  });

  sendMessage(`event.source.${song.type}.end`, { item: song.title });

  stopCurrentSong();

  ee.emit(`onUpdate`, { song: { remove: [song.id] } });

  client.voiceConnection.stopStream();

  removeSongFromQueue(song);

  const nextSong = await getNextSong();
  if (nextSong) {
    await addSongToQueue(nextSong);
  }
};

async function onSongError(this: ProcessQueueItem, error: string) {
  try {
    if (stream) {
      stream.destroy();
    }

    this.retryCount += 1;

    const shouldStop = this.retryCount > MAX_RETRIES;

    sendErrorMessage(shouldStop ? "event.error" : "event.retry", {
      item: this.song.title,
      error,
    });

    if (shouldStop) {
      this.status = ProcessQueueItemStatus.skipped;
      await onSongEnd(this.song);
    }

    setTimeout(() => {
      void processQueue(this);
    }, 5000);
  } catch (e) {
    console.log("e", e);
  }
}

const createStream = async (song: Song) => {
  if (song.type === SourceType.SONG) {
    return createYoutubeStream(song);
  }

  if (song.type === SourceType.RADIO) {
    return await createRadioStream(song);
  }

  throw new Error("Unknown song type");
};

async function onPlayStart(this: ProcessQueueItem) {
  try {
    this.status = ProcessQueueItemStatus.processing;

    if (this.status !== ProcessQueueItemStatus.processing) {
      throw new Error("Failed to update song status");
    }

    sendMessage(`event.source.${this.song.type}.start`, {
      item: this.song.title,
    });

    if (this.song.type === SourceType.SONG) {
      const videoInfo = await getVideoInfo(this.song);
      if (!videoInfo) {
        throw new Error("Failed to get video info");
      }

      this.song.startedAt = DateTime.now();
      this.song.duration = videoInfo.duration;

      const secondsLeft = this.song.startedAt
        .plus({ seconds: videoInfo.duration })
        .diffNow("seconds").seconds;

      if (endTimeout) clearTimeout(endTimeout);

      endTimeout = setTimeout(() => {
        onSongEnd(this.song).catch((e) => {
          console.log("e", e);
        });
      }, secondsLeft * 1000);
    } else {
      this.song.startedAt = DateTime.now();
    }

    await prisma.song.update({
      where: {
        id: this.song.id,
      },
      data: {
        started: true,
      },
    });

    return this.song;
  } catch (e) {
    if (e instanceof Error) {
      void onSongError.call(this, e.message);
    }
  }
}

export async function playSong(this: ProcessQueueItem) {
  try {
    if (endTimeout) {
      clearTimeout(endTimeout);
    }

    if (stream) {
      stream.destroy();
    }

    stream = await createStream(this.song);

    ee.emit(`onUpdate`, {
      song: { setPlaying: this.song },
    });

    let started = false;
    stream.on("data", () => {
      if (!started) {
        started = true;

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

export const getCurrentSong = (): PlayingSong | undefined => {
  const item = processingQueue.at(0);

  if (!item || item.status !== ProcessQueueItemStatus.processing) {
    return undefined;
  }

  return item.song;
};

export const stopCurrentSong = () => {
  if (stream) {
    stream.destroy();
  }

  client.voiceConnection.stopStream();
  clearTimeout(endTimeout);

  ee.emit(`onUpdate`, {
    song: { setPlaying: undefined },
  });
};

export const getNextSong = async (): Promise<Song | null> => {
  return await prisma.song.findFirst({
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
  });
};
