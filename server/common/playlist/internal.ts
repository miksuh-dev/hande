/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Readable } from "stream";
import { Song } from "@prisma/client";
import { DateTime } from "luxon";
import { PlayingSong } from "types/app";
import ee from "../../eventEmitter";
import prisma from "../../prisma";
import { sendErrorMessage, sendMessage } from "../../router/room/message";
import client from "../mumble";
const YoutubeDlWrap = require("youtube-dl-wrap");
const youtubeDlWrap = new YoutubeDlWrap("/usr/bin/youtube-dl");

let playing: PlayingSong | undefined;

let stream: Readable | undefined;
let endTimeout: NodeJS.Timeout | undefined;

export const onSongEnd = async () => {
  if (!playing) return;

  await prisma.song.update({
    where: {
      id: playing.id,
    },
    data: {
      ended: true,
    },
  });

  sendMessage(`Kappale ${playing.title} päättyi.`);

  stopCurrentSong();

  client.voiceConnection.stopStream();
  const nextSong = await getNextSong();
  if (nextSong) {
    playSong(nextSong);
  } else {
    ee.emit(`onUpdate`, {
      song: { setPlaying: undefined },
    });
  }
};

const createStream = (song: Song) => {
  try {
    const readStream = youtubeDlWrap.execStream([
      `https://www.youtube.com/watch?v=${song.videoId}`,
      "-f",
      "m4a",
    ]) as Readable;

    return readStream;
  } catch (e) {
    console.log("e", e);
  }
};

const onPlayError = (song: Song, error: string) => {
  sendErrorMessage(
    `Virhe kappaleen ${song.title} toistossa. Siirrytään seuraavaan kappaleeseen 5 sekunnin kuluttua. (${error})`
  );

  setTimeout(() => {
    if (playing?.id === song.id) {
      onSongEnd().catch((e) => console.log("e", e));
    }
  }, 5000);
};

export const playSong = (song: Song) => {
  console.log("play");
  const currentSong = setCurrentSong({
    ...song,
    startedAt: DateTime.now(),
  });

  ee.emit(`onUpdate`, {
    song: { setPlaying: currentSong },
  });

  ee.emit(`onUpdate`, {
    song: { remove: currentSong.id },
  });

  sendMessage(`Soitetaan kappale ${currentSong.title}.`);

  if (stream) {
    stream.destroy();
  }

  if (endTimeout) {
    clearTimeout(endTimeout);
  }

  const secondsLeft = currentSong.startedAt
    .plus({ seconds: currentSong.duration })
    .diffNow("seconds").seconds;

  console.log("secondsLeft", secondsLeft);

  endTimeout = setTimeout(() => {
    onSongEnd().catch((e) => console.log("e", e));
  }, secondsLeft * 1000);

  stream = createStream(song);
  if (!stream) {
    sendErrorMessage("Virhe luodessa streamia");
    return;
  }

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
};

export const getNextSong = async (): Promise<Song | null> => {
  return await prisma.song.findFirst({
    where: {
      ended: false,
      skipped: false,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};
