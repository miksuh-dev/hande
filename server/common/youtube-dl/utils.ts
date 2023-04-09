/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Readable } from "stream";
import { Song } from "types/prisma";
import { VideoInfo } from "./types";
const YoutubeDlWrap = require("youtube-dl-wrap");
const youtubeDlWrap = new YoutubeDlWrap(process.env.YOUTUBE_DL_LOCATION);

export const createStream = (song: Song) => {
  return youtubeDlWrap.execStream([song.url, "-f", "m4a"]) as Readable;
};

export const getVideoInfo = async (song: Song) => {
  try {
    const metadata = await youtubeDlWrap.getVideoInfo(song.url);

    if (!metadata) {
      throw new Error("No metadata");
    }

    return metadata as VideoInfo;
  } catch (e) {
    console.log("e", e);
  }
};
