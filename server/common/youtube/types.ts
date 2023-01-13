interface YoutubeListResult {
  data: {
    pageInfo: {
      totalResults: number;
      resultsPerPage: number;
    };
  };
}

export type YoutubeSongResult = YoutubeListResult & {
  data: {
    items: YoutubeItemSong[];
  };
};

export type YoutubePlaylistSongResult = YoutubeListResult & {
  data: {
    items: YoutubeItemPlaylistSong[];
  };
};

export type YoutubePlaylistResult = YoutubeListResult & {
  data: {
    items: YoutubeItemPlaylist[];
  };
};

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

export interface SearchResultThumbnail {
  height: number;
  url: string;
  width: number;
}

export enum YoutubeResultKind {
  Video = "youtube#video",
  Playlist = "youtube#playlist",
}

interface YoutubeResultItem {
  kind: string;
  etag: string;
  id:
    | {
        kind: YoutubeResultKind;
      }
    | string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    liveBroadcastContent: string;
    publishTime: string;
    publishedAt: string;
    thumbnails:
      | {
          default: SearchResultThumbnail;
          high: SearchResultThumbnail;
          medium: SearchResultThumbnail;
        }
      | Record<string, never>;
    title: string;
  };
}

export type YoutubeItemSong = YoutubeResultItem & {
  id: {
    kind: YoutubeResultKind.Video;
    videoId: string;
  };
};

export type YoutubeItemPlaylistSong = YoutubeResultItem & {
  id: string;
  snippet: {
    resourceId: {
      kind: YoutubeResultKind.Video;
      videoId: string;
    };
  };
};

export type YoutubeItemPlaylist = YoutubeResultItem & {
  id: {
    kind: YoutubeResultKind.Playlist;
    playlistId: string;
  };
};
