type GeniusSearchResult = {
  annotation_count: number;
  api_path: string;
  full_title: string;
  header_image_thumbnail_url: string;
  header_image_url: string;
  id: string;
  path: string;
  primary_artist: {
    api_path: string;
    header_image_url: string;
    id: number;
    image_url: string;
    is_meme_verified: boolean;
    is_verified: boolean;
    name: string;
    url: string;
  };
  pyongs_count: number;
  song_art_image_thumbnail_url: string;
  stats: {
    hot: boolean;
    unreviewed_annotations: number;
    pageviews: number;
  };
  title: string;
  title_with_featured: string;
  url: string;
};

export type GeniusSearchHit = {
  highlights: unknown[];
  index: string;
  type: string;
  result: GeniusSearchResult;
};

export type GeniusSearchResponse = {
  data: {
    meta: {
      status: number;
    };
    response: {
      hits: GeniusSearchHit[];
    };
  };
};
