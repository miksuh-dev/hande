export interface SearchListResult {
  data: {
    items: SearchResultItem[];
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
