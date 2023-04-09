import { Song as PrismaSong } from "@prisma/client";
import { SourceType } from "./source";

export type WithSongType<T> = Omit<T, "type"> & {
  type: SourceType.SONG | SourceType.RADIO;
};
export type Song = WithSongType<PrismaSong>;
