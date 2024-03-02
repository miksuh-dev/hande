export enum SourceType {
  SONG = "song",
  PLAYLIST = "playlist",
  RADIO = "radio",
}

export enum SongType {
  SONG = "song",
  RADIO = "radio",
}

export const SOURCES = [
  {
    id: 1,
    value: SourceType.SONG,
  },
  {
    id: 2,
    value: SourceType.PLAYLIST,
  },
  {
    id: 3,
    value: SourceType.RADIO,
  },
];

export type Source = (typeof SOURCES)[number];
