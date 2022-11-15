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

const onPlayError = (song: Song, error: string) => {
  sendErrorMessage(
    `Virhe kappaleen ${song.title} toistossa. Siirrytään seuraavaan kappaleeseen 5 sekunnin kuluttua. (${error})`
  );

  setTimeout(() => {
    onSongEnd().catch((e) => console.log("e", e));
  }, 5000);
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
  if (!stream) {
    sendErrorMessage("Failed to create stream");
    return;
  }

  stream
    .on("close", () => {
      void (async () => {
        sendMessage(`Kappale ${currentSong.title} päättyi.`);
        await onSongEnd().catch((e) => {
          if (e instanceof Error) {
            onPlayError(currentSong, e.message);
          }
        });
      })();

      stream.destroy();
    })
    .on("error", (e) => {
      if (e instanceof Error) {
        onPlayError(currentSong, e.message);
      }
    });

  client.voiceConnection
    .playStream(stream, "asd")
    .on("start", async () => {
      sendMessage(`Soitetaan kappale ${currentSong.title}.`);

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
