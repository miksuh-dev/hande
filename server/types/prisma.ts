import { Song as PrismaSong } from "@prisma/client";
import { SongType } from "./source";

export type SongProperties<
  S extends PrismaSong,
  T extends SongType
> = T extends SongType.SONG
  ? Omit<S, "type"> & {
      type: T;
      originalRequester?: string;
    }
  : Omit<S, "type"> & {
      type: T;
    };

export type Song<T extends SongType = SongType> = SongProperties<PrismaSong, T>;
