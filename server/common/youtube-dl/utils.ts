/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Readable } from "stream";
import { Server } from "@server/types/app";
import { VideoInfo } from "./types";
import { Song } from "../../types/prisma";
const YoutubeDlWrap = require("youtube-dl-wrap");
const youtubeDlWrap = new YoutubeDlWrap(process.env.YOUTUBE_DL_LOCATION);

export const createStream = (song: Song<Server>) => {
  return youtubeDlWrap.execStream([song.url, "-f", "m4a"]) as Readable;
};

export const getVideoInfo = async (song: Song<Server>) => {
  try {
    const metadata = await youtubeDlWrap.getVideoInfo(song.url);

    if (!metadata) {
      throw new Error("No metadata");
    }

    return metadata as VideoInfo;
  } catch (e) {
    console.log("e", e);
  }

  return undefined;
};
