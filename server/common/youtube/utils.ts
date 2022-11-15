import { SearchResultItem } from "./types";

export const parseSearchListItem = (item: SearchResultItem) => {
  return {
    videoId: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.medium,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  };
};

export const parseDuration = (duration: string) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) {
    throw new Error(`Invalid duration ${duration}`);
  }

  const hours = parseInt(match[1] ?? "0", 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const seconds = parseInt(match[3] ?? "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
};
