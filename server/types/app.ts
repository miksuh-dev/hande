import { DateTime } from "luxon";
import { SongType } from "@server/types/source";
import { Song } from "./prisma";

export enum PlayState {
  PLAYING = "PLAYING",
  ENDED = "ENDED",
}

export type Server = "server";
export type Client = "client";
export type Location = Server | Client;

type ServerClient<L extends Location, SP, CP> = L extends Server ? SP : CP;

type PlayingSongProperty<
  S extends Song,
  T extends SongType
> = T extends SongType.SONG
  ? S & {
      type: T;
      duration: number;
    }
  : S & {
      type: T;
    };

export type PlayingSong<
  L extends Location,
  T extends SongType = SongType
> = PlayingSongProperty<Song<T>, T> & {
  startedAt: string;
  endedAt?: ServerClient<L, DateTime, string>;
  rating: number;
  volume: number;
  vote?: VoteType | undefined;
  state: PlayState;
};

export enum VoteType {
  UP = "UP",
  DOWN = "DOWN",
  NONE = "NONE",
}
