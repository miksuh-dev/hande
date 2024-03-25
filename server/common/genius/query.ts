import { TRPCError } from "@trpc/server";
import axios from "axios";
import { parse } from "node-html-parser";
import { GeniusSearchResponse } from "./types";

let lyricsCache:
  | { artist: string; track: string; lyrics: string | undefined }
  | undefined = undefined;

const setLyricsCache = (
  artist: string,
  track: string,
  lyrics: string | undefined
) => {
  lyricsCache = { artist, track, lyrics };
};

const hasCachedLyrics = (artist: string, track: string) => {
  if (lyricsCache?.artist === artist && lyricsCache?.track === track) {
    return true;
  }

  return false;
};

const getLyricsCache = () => {
  if (lyricsCache?.lyrics === undefined) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "error.lyricsNotFound",
    });
  }

  return lyricsCache.lyrics;
};

export const searchSongLyrics = async (
  artist: string,
  track: string
): Promise<string | undefined> => {
  try {
    if (hasCachedLyrics(artist, track)) {
      return getLyricsCache();
    }

    const songId = await getSongId(artist, track);
    if (!songId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "error.lyricsNotFound",
      });
    }
    const lyrics = await getLyrics(songId);

    setLyricsCache(artist, track, lyrics);

    return lyrics;
  } catch (error) {
    if (error instanceof TRPCError) {
      if (error.code === "NOT_FOUND") {
        setLyricsCache(artist, track, undefined);
      }
    }

    throw error;
  }
};

export const getSongId = async (
  artist: string,
  track: string
): Promise<string | undefined> => {
  if (!process.env.GENIUS_ACCESS_TOKEN) {
    throw new Error("GENIUS_ACCESS_TOKEN is not set");
  }

  const url = `https://api.genius.com/search?q=${artist} ${track}`;

  const {
    data: { meta, response },
  }: GeniusSearchResponse = await axios({
    method: "get",
    url,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Accept: "application/json",
      Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`,
    },
  });

  if (meta.status === 404) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "error.lyricsNotFound",
    });
  }

  if (meta.status !== 200) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "error.lyricsApiError",
    });
  }

  const result = response.hits[0]?.result;
  if (!result) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "error.lyricsNotFound",
    });
  }

  return result.id;
};

export const getLyrics = async (songId: string) => {
  const { data }: { data: string } = await axios({
    method: "get",
    url: `https://genius.com/songs/${songId}`,
  });

  const root = parse(data);
  const lyrics = root.querySelectorAll('div[data-lyrics-container="true"]');

  const parsedLyrics = lyrics.map((node) => node.textContent).join("\n");
  if (!parsedLyrics.length) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "error.lyricsNotFound",
    });
  }

  return parsedLyrics;
};
