import { Song as PrismaSong } from "@prisma/client";
import { Location, ServerClient } from "@server/types/app";
import { SongType } from "./source";

export type SongProperties<T extends SongType> = T extends SongType.SONG
  ? {
      type: T;
      originalRequester?: string;
    }
  : {
      type: T;
    };

export type Song<L extends Location, T extends SongType = SongType> = Omit<
  PrismaSong,
  "createdAt"
> & {
  createdAt: ServerClient<L, PrismaSong["createdAt"], string>;
} & SongProperties<T>;
