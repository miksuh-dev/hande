import { Song as PrismaSong } from "@prisma/client";
import { SourceType } from "./source";

export type WithSongTypeAny<T> = Omit<T, "type"> & {
  type: SourceType.SONG | SourceType.RADIO;
};

export type SongTypeSong = Omit<PrismaSong, "type"> & {
  type: SourceType.SONG;
};

export type WithType<
  S extends PrismaSong,
  T extends SourceType
> = T extends SourceType.SONG
  ? Omit<S, "duration"> & {
      type: T;
      duration: number;
    }
  : {
      type: T;
    };

export type Song = WithSongTypeAny<PrismaSong>;
