export enum PLAYERSTATE {
  BUFFERING = 3,
  CUED = 5,
  ENDED = 0,
  PAUSED = 2,
  PLAYING = 1,
  UNSTARTED = -1,
}

export enum PLAYBACK_QUALITY {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  HD720 = "hd720",
  HD1080 = "hd1080",
  HIGHRES = "highres",
}

type Error = {
  INVALID_PARAM: 2;
  HTML5_ERROR: 5;
  VIDEO_NOT_FOUND: 100;
  VIDEO_NOT_PLAYABLE: 101;
  VIDEO_NOT_PLAYABLE_2: 150;
};

export type ReadyEvent = {
  data: number | null;
  // partially typed (Only used functions)
  target: {
    seekTo: (second: number) => void;
  };
};

export type PlayerOptions = {
  height?: number;
  width?: number;
  videoId: string;
  playerVars?: {
    autoplay?: number;
    controls?: number;
    disablekb?: number;
    enablejsapi?: number;
    fs?: number;
    iv_load_policy?: number;
    modestbranding?: number;
    playsinline?: number;
    rel?: number;
    showinfo?: number;
    start?: number;
    end?: number;
    origin?: string;
    widget_referrer?: string;
    mute?: number;
  };
  events?: {
    onReady?: (event: ReadyEvent) => void;
    onStateChange?: (data: PLAYERSTATE) => void;
    onPlaybackQualityChange?: (data: PLAYBACK_QUALITY) => void;
    onError?: (event: Error) => void;
  };
};

type PlayerConstructor = {
  new (element: string, options: PlayerOptions): void;
};

export interface CustomWindow extends Window {
  YT?: {
    Player: PlayerConstructor;
    PlayerState: PLAYERSTATE;
    get: (id: string) => unknown;
    loaded: number;
    loading: number;
    ready: (callback: () => void) => void;
    scan: () => void;
    setConfig: (config: unknown) => void;
    subscribe: (event: string, callback: () => void) => void;
    unsubscribe: (event: string, callback: () => void) => void;
  };
}
