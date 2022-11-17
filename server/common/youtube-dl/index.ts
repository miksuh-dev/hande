/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Readable } from "stream";
import { Song } from "@prisma/client";
import { VideoInfo } from "./types";
const YoutubeDlWrap = require("youtube-dl-wrap");
const youtubeDlWrap = new YoutubeDlWrap(process.env.YOUTUBE_DL_LOCATION);

export const createStream = (song: Song) => {
  const readStream = youtubeDlWrap.execStream([
    `https://www.youtube.com/watch?v=${song.videoId}`,
    "-f",
    "m4a",
  ]) as Readable;

  return readStream;
};

export const getVideoInfo = async (song: Song) => {
  try {
    const metadata = await youtubeDlWrap.getVideoInfo(
      `https://www.youtube.com/watch?v=${song.videoId}`
    );

    if (!metadata) {
      throw new Error("No metadata");
    }

    return metadata as VideoInfo;
  } catch (e) {
    console.log("e", e);
  }
};
