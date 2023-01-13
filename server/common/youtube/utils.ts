import { SourceResultPlaylist, SourceResultSong } from "router/room/types";
import {
  YoutubeItemPlaylist,
  YoutubeItemPlaylistSong,
  YoutubeItemSong,
} from "./types";

export const parseSong = (item: YoutubeItemSong): SourceResultSong => {
  return {
    contentId: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.medium,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    type: "song",
  };
};

export const parsePlaylistSong = (
  item: YoutubeItemPlaylistSong
): SourceResultSong => {
  return {
    contentId: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.medium,
    url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
    type: "song",
  };
};

export const parsePlaylist = (
  item: YoutubeItemPlaylist
): SourceResultPlaylist => {
  return {
    contentId: item.id.playlistId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.medium,
    url: `https://www.youtube.com/playlist?list=${item.id.playlistId}`,
    type: "playlist",
  };
};
