import * as radio from "../../common/radio";
import * as youtube from "../../common/youtube";
import {
  SourceResultSong,
  SourceResultPlaylist,
  SourceResultRadio,
} from "./types";

export enum SourceType {
  SONG = "song",
  PLAYLIST = "playlist",
  RADIO = "radio",
}

export const SOURCES = [
  {
    id: 1,
    value: SourceType.SONG,
  },
  {
    id: 2,
    value: SourceType.PLAYLIST,
  },
  {
    id: 3,
    value: SourceType.RADIO,
  },
];

export const searchFromSource = async (
  text: string,
  source: SourceType
): Promise<(SourceResultSong | SourceResultPlaylist | SourceResultRadio)[]> => {
  switch (source) {
    case "song":
      return youtube
        .searchListSong(text)
        .then((res) => res.map(youtube.parseSong));
    case "playlist":
      return youtube
        .searchListPlaylist(text)
        .then((res) => res.map(youtube.parsePlaylist));
    case "radio":
      return radio
        .searchList(text)
        .then((res) => res.map(radio.parseSearchListItem));
    default:
      throw new Error("Invalid source");
  }
};

export const searchFromPlaylist = async (
  playlistId: string
): Promise<SourceResultSong[]> => {
  const result = await youtube.playlistItems(playlistId);

  return result.map(youtube.parsePlaylistSong);
};
