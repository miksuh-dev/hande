import { SearchResultItem } from "./types";

export const parseSearchListItem = (item: SearchResultItem) => {
  return {
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.medium,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  };
};
