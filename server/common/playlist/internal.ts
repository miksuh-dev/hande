/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { Readable } from "stream";
import { Readable } from "node:stream";
import { Song } from "@prisma/client";
import prisma from "prisma";
import client from "../mumble";
const YoutubeDlWrap = require("youtube-dl-wrap");
const youtubeDlWrap = new YoutubeDlWrap("/usr/bin/youtube-dl");

let playing: Song;

export const playSong = (song: Song) => {
  playing = song;

  const readStream = youtubeDlWrap.execStream([
    `https://www.youtube.com/watch?v=${song.videoId}`,
    "-f",
    "best",
  ]) as Readable;
  console.log("readStream", readStream);

  client.voiceConnection.playStream(readStream, 0).on("end", () => {
    void (async () => {
      await prisma.song.update({
        where: {
          id: song.id,
        },
        data: {
          ended: true,
        },
      });

      const nextSong = await getNextSong();

      if (nextSong) {
        playing = song;
        playSong(nextSong);
      }
    })();
  });
};

export const stopSong = () => {
  client.voiceConnection.stopStream();
};

export const getCurrentSong = (): Song | undefined => {
  return playing;
};

export const getNextSong = async (): Promise<Song | null> => {
  return await prisma.song.findFirst({
    where: {
      ended: false,
      skipped: false,
    },
  });
};
