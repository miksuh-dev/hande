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
import { PlayError } from "./types";

const MAX_RETRIES = 3;

let playing: PlayingSong | undefined;
let stream: Readable | undefined;
let endTimeout: NodeJS.Timeout | undefined;
let playError: PlayError | undefined;

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
  const nextSong = await getNextSong();
  if (nextSong) {
    await playSong(nextSong);
  }
};

const handleSongErrorTimeout = async (song: Song) => {
  // Ignore as error is no longer relevant
  if (!playError || playError.id !== song.id) {
    return;
  }

  if (playError.retryCount > MAX_RETRIES) {
    return onSongEnd(song);
  }

  return playSong(song);
};

const onPlayError = (song: Song, error: string) => {
  if (!playError || playError.id !== song.id) {
    playError = {
      id: song.id,
      retryCount: 0,
    };
  }

  playError.retryCount += 1;

  sendErrorMessage(
    playError.retryCount > MAX_RETRIES ? "event.error" : "event.retry",
    { item: song.title, error }
  );

  setTimeout(() => {
    handleSongErrorTimeout(song).catch((e) => {
      if (e instanceof Error) {
        onPlayError(song, e.message);
      }
      console.log("e", e);
    });
  }, 5000);
};

const createStream = async (song: Song) => {
  if (song.type === SourceType.SONG) {
    return createYoutubeStream(song);
  }

  if (song.type === SourceType.RADIO) {
    return await createRadioStream(song);
  }

  throw new Error("Unknown song type");
};

const playYoutubeSong = async (song: Song): Promise<PlayingSong> => {
  const videoInfo = await getVideoInfo(song);
  if (!videoInfo) {
    throw new Error("Failed to get video info");
  }

  const currentSong = setCurrentSong({
    ...song,
    startedAt: DateTime.now(),
    duration: videoInfo.duration,
  });

  sendMessage(`event.source.${song.type}.start`, { item: song.title });

  const secondsLeft = currentSong.startedAt
    .plus({ seconds: videoInfo.duration + 3 })
    .diffNow("seconds").seconds;

  if (endTimeout) {
    clearTimeout(endTimeout);
  }
  endTimeout = setTimeout(() => {
    onSongEnd(song).catch((e) => {
      if (e instanceof Error) {
        onPlayError(song, e.message);
      }
      console.log("e", e);
    });
  }, secondsLeft * 1000);

  return currentSong;
};

const playRadioSong = (song: Song): PlayingSong => {
  const currentSong = setCurrentSong({
    ...song,
    startedAt: DateTime.now(),
  });

  sendMessage(`event.source.${song.type}.start`, { item: song.title });

  return currentSong;
};

const getNewCurrentSong = async (song: Song): Promise<PlayingSong> => {
  if (song.type === SourceType.SONG) {
    return playYoutubeSong(song);
  }

  if (song.type === SourceType.RADIO) {
    return playRadioSong(song);
  }

  throw new Error("Unknown song type");
};

export const playSong = async (song: Song) => {
  try {
    if (endTimeout) {
      clearTimeout(endTimeout);
    }

    const currentSong = await getNewCurrentSong(song);

    if (stream) {
      stream.destroy();
    }

    ee.emit(`onUpdate`, {
      song: { setPlaying: currentSong },
    });

    stream = await createStream(song);

    stream.on("error", (e) => {
      if (e instanceof Error) {
        onPlayError(currentSong, e.message);
      }
    });

    client.voiceConnection
      .playStream(stream, "0")
      .on("start", async () => {
        await prisma.song.update({
          where: {
            id: currentSong.id,
          },
          data: {
            started: true,
          },
        });
      })
      .on("error", (message: string) => {
        onPlayError(currentSong, message);
      });
  } catch (e) {
    if (e instanceof Error) {
      onPlayError(song, e.message);
    }
  }
};

export const getCurrentSong = (): PlayingSong | undefined => {
  return playing;
};

export const setCurrentSong = (song: PlayingSong) => {
  return (playing = song);
};

export const stopCurrentSong = () => {
  playing = undefined;

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
