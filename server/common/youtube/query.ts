import axios from "axios";
import {
  YoutubeItemPlaylist,
  YoutubeItemPlaylistSong,
  YoutubeItemSong,
  YoutubePlaylistResult,
  YoutubePlaylistSongResult,
  YoutubeSongResult,
} from "./types";

export const searchListSong = async (
  content: string
): Promise<YoutubeItemSong[]> => {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API is not set");
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&safeSearch=none&type=video&maxResults=5&key=${process.env.YOUTUBE_API_KEY}&q=${content}`;

    const { data }: YoutubeSongResult = await axios({
      method: "get",
      url,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    });

    return data.items;
  } catch (error) {
    console.error(error);

    throw new Error("Youtube haku epäonnistui");
  }
};

export const searchListPlaylist = async (
  content: string
): Promise<YoutubeItemPlaylist[]> => {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API is not set");
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&safeSearch=none&type=playlist&maxResults=5&key=${process.env.YOUTUBE_API_KEY}&q=${content}`;

    const { data }: YoutubePlaylistResult = await axios({
      method: "get",
      url,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    });

    return data.items;
  } catch (error) {
    console.error(error);

    throw new Error("Youtube haku epäonnistui");
  }
};

export const playlistItems = async (
  playlistId: string
): Promise<YoutubeItemPlaylistSong[]> => {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API is not set");
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&part=snippet&maxResults=50&key=${process.env.YOUTUBE_API_KEY}`;

    const { data }: YoutubePlaylistSongResult = await axios({
      method: "get",
      url,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
    });

    return data.items.filter(
      // Deleted videos are missing thumbnails
      (item) => Object.keys(item.snippet.thumbnails).length > 0
    );
  } catch (error) {
    console.error(error);

    throw new Error("Youtube haku epäonnistui");
  }
};
