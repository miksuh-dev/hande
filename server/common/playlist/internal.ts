/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Readable } from "stream";
import { Song } from "@prisma/client";
import { DateTime } from "luxon";
import { PlayingSong } from "types/app";
import ee from "../../eventEmitter";
import prisma from "../../prisma";
import { sendErrorMessage, sendMessage } from "../../router/room/message";
import client from "../mumble";
import { createStream as createRadioStream } from "../radio";
import {
  createStream as createYoutubeStream,
  getVideoInfo,
} from "../youtube-dl";

let playing: PlayingSong | undefined;

let stream: Readable | undefined;
let endTimeout: NodeJS.Timeout | undefined;

export const onSongEnd = async (song: Song) => {
  await prisma.song.update({
    where: {
      id: song.id,
    },
    data: {
      ended: true,
    },
  });

  if (song.type === "youtube") {
    sendMessage(`Kappale "${song.title}" päättyi.`);
  } else if (song.type === "radio") {
    sendMessage(`Radiokanavan "${song.title}" toisto päättyi.`);
  }

  stopCurrentSong();

  ee.emit(`onUpdate`, { song: { remove: song.id } });

  client.voiceConnection.stopStream();
  const nextSong = await getNextSong();
  if (nextSong) {
    await playSong(nextSong);
  }
};

const onPlayError = (song: Song, error: string) => {
  sendErrorMessage(
    `Virhe kappaleen ${song.title} toistossa. Siirrytään seuraavaan kappaleeseen 5 sekunnin kuluttua. (${error})`
  );

  setTimeout(() => {
    if (playing?.id === song.id || !playing) {
      onSongEnd(song).catch((e) => {
        if (e instanceof Error) {
          onPlayError(song, `Virhe kappaleen päättämisessä: ${e.message}`);
        }
        console.log("e", e);
      });
    }
  }, 5000);
};

const createStream = async (song: Song) => {
  if (song.type === "youtube") {
    return createYoutubeStream(song);
  }

  if (song.type === "radio") {
    return await createRadioStream(song);
  }

  throw new Error("Unknown song type");
};

const playYoutubeSong = async (song: Song): Promise<PlayingSong> => {
  const videoInfo = await getVideoInfo(song);
  if (!videoInfo) {
    throw new Error("Video info not available");
  }

  const currentSong = setCurrentSong({
    ...song,
    startedAt: DateTime.now(),
    duration: videoInfo.duration,
  });

  sendMessage(`Soitetaan kappale "${currentSong.title}".`, {});

  const secondsLeft = currentSong.startedAt
    .plus({ seconds: videoInfo.duration + 3 })
    .diffNow("seconds").seconds;

  endTimeout = setTimeout(() => {
    onSongEnd(song).catch((e) => {
      if (e instanceof Error) {
        onPlayError(song, `Virhe kappaleen päättämisessä: ${e.message}`);
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

  sendMessage(`Toistetaan radiokanavaa "${currentSong.title}".`, {});

  return currentSong;
};

const getNewCurrentSong = async (song: Song): Promise<PlayingSong> => {
  if (song.type === "youtube") {
    return playYoutubeSong(song);
  }

  if (song.type === "radio") {
    return playRadioSong(song);
  }

  throw new Error("Unknown song type");
};

export const playSong = async (song: Song) => {
  const currentSong = await getNewCurrentSong(song);

  if (stream) {
    stream.destroy();
  }

  if (endTimeout) {
    clearTimeout(endTimeout);
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
