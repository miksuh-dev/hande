interface Thumbnail {
  height: number;
  url: string;
  width: number;
  resolution: string;
  id: number;
}

interface Format {
  asr: number;
  filesize: number;
  format_id: string;
  format_note: string;
  fps: null;
  height: null;
  quality: 0;
  tbr: 48.995;
  url: string;
  width: null;
  ext: string;
  vcodec: string;
  acodec: string;
  abr: 48.995;
  downloader_options: Record<string, number>;
  container: string;
  format: string;
  protocol: string;
  http_headers: Record<string, number>;
}

export interface VideoInfo {
  id: string;
  title: string;
  formats: Format[];
  thumbnails: Thumbnail[];
  description: string;
  upload_date: string;
  uploader: string;
  uploader_id: string;
  uploader_url: string;
  channel_id: string;
  channel_url: string;
  duration: 26;
  view_count: 756;
  average_rating: null;
  age_limit: 0;
  webpage_url: string;
  categories: string[];
  tags: string[];
  is_live: null;
  channel: string;
  extractor: string;
  webpage_url_basename: string;
  extractor_key: string;
  playlist: null;
  playlist_index: null;
  thumbnail: string;
  display_id: string;
  requested_subtitles: null;
  asr: 44100;
  filesize: null;
  format_id: string;
  format_note: string;
  fps: 30;
  height: 720;
  quality: 4;
  tbr: 404.486;
  url: string;
  width: 1280;
  ext: string;
  vcodec: string;
  acodec: string;
  format: string;
  protocol: string;
  http_headers: Record<string, number>;
  fulltitle: string;
  _filename: string;
}
