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
import { sendErrorMessage } from "../../router/room/message";
import client from "../mumble";
const YoutubeDlWrap = require("youtube-dl-wrap");
const youtubeDlWrap = new YoutubeDlWrap("/usr/bin/youtube-dl");

let playing: PlayingSong | undefined;

client.voiceConnection.on("end", () => {
  onSongEnd.call(this).catch((e) => {
    console.log("e", e);
  });
});

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

  await stopCurrentSong();

  ee.emit(`onUpdate`, {
    song: { setPlaying: undefined },
  });

  client.voiceConnection.stopStream();

  const nextSong = await getNextSong();
  if (nextSong) {
    playSong(nextSong);
  }
};

const createStream = (song: Song) => {
  try {
    const readStream = youtubeDlWrap.execStream([
      `https://www.youtube.com/watch?v=${song.videoId}`,
      "-f",
      "best",
    ]) as Readable;

    return readStream;
  } catch (e) {
    console.log("e", e);
  }
};

export const playSong = (song: Song) => {
  const currentSong = setCurrentSong({
    ...song,
    startedAt: DateTime.now().plus({ seconds: 5 }),
  });

  ee.emit(`onUpdate`, {
    song: { setPlaying: currentSong },
  });

  ee.emit(`onUpdate`, {
    song: { remove: currentSong.id },
  });

  const stream = createStream(song);

  client.voiceConnection
    .playStream(stream, "asd")
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
      sendErrorMessage(
        `Virhe kappaleen ${song.title} toistossa. Siirrytään seuraavaan kappaleeseen 5 sekunnin kuluttua. (${message})`
      );
      setTimeout(() => {
        onSongEnd.call(this).catch((e) => {
          console.log("e", e);
        });
      }, 5000);
    });
};

export const getCurrentSong = (): PlayingSong | undefined => {
  return playing;
};

export const setCurrentSong = (song: PlayingSong) => {
  return (playing = song);
};

export const stopCurrentSong = async () => {
  playing = undefined;

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
