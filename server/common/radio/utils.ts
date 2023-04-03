import { Readable } from "stream";
import { Song } from "@prisma/client";
import m3u8stream from "m3u8stream";
import { SourceResultRadio } from "router/room/types";
import { SourceType } from "../../router/room/sources";
import { addRadioClickCount } from "./mutation";
import { SearchResultItem } from "./types";

export const createStream = async (song: Song) => {
  const addedClick = await addRadioClickCount(song.contentId);

  if (!addedClick.ok) {
    throw new Error("Failed to add radio click count");
  }

  return m3u8stream(song.url) as Readable;
};

export const generateUserAgentString = () => {
  const version = process.env.npm_package_version;

  if (!version) {
    throw new Error("npm_package_version is not set");
  }

  return `Hande/${version} miksuh-dev/hande`;
};

export const parseSearchListItem = (
  item: SearchResultItem
): SourceResultRadio => {
  return {
    url: item.url,
    contentId: item.stationuuid,
    title: item.name,
    description: "",
    thumbnail: null,
    type: SourceType.RADIO,
  };
};
