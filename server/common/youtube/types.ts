import { parseSearchListItem } from "./utils";

export interface SearchListResult {
  data: {
    items: SearchResultItem[];
  };
}

export interface VideoContentDetails {
  contentDetails: {
    duration: string;
    dimension: "2d" | "3d";
    definition: "hd" | "sd";
    caption: "true" | "false";
    licensedContent: "allowed" | "blocked";
    contentRating: string[];
    projection: "rectangular" | "360";
  };
}

interface SearchResultThumbnail {
  height: number;
  url: string;
  width: number;
}

export interface SearchResultItem {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    liveBroadcastContent: string;
    publishTime: string;
    publishedAt: string;
    thumbnails: {
      default: SearchResultThumbnail;
      high: SearchResultThumbnail;
      medium: SearchResultThumbnail;
    };
    title: string;
  };
}

export type SearchResultOutput = ReturnType<typeof parseSearchListItem>;
