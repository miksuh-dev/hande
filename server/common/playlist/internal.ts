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
import { createStream, getVideoInfo } from "../youtube-dl";

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
    await playSong(nextSong);
  } else {
    ee.emit(`onUpdate`, {
      song: { setPlaying: undefined },
    });
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

export const playSong = async (song: Song) => {
  const videoInfo = await getVideoInfo(song);
  if (!videoInfo) {
    onPlayError(song, "Ei videoinfoa");
    return;
  }

  const currentSong = setCurrentSong({
    ...song,
    startedAt: DateTime.now(),
    duration: videoInfo.duration,
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
    .plus({ seconds: videoInfo.duration })
    .diffNow("seconds").seconds;

  endTimeout = setTimeout(() => {
    onSongEnd().catch((e) => console.log("e", e));
  }, secondsLeft * 1000);

  stream = createStream(song);

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
