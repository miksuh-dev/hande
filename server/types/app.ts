import { SongType } from "@server/types/source";
import { Song } from "./prisma";

export enum PlayState {
  STARTING = "STARTING",
  PLAYING = "PLAYING",
  ENDED = "ENDED",
}

export type Server = "server";
export type Client = "client";
export type Location = Server | Client;

export type ServerClient<L extends Location, SP, CP> = L extends Server
  ? SP
  : CP;

type PlayingSongProperty<T extends SongType> = T extends SongType.SONG
  ? {
      type: T;
      duration: number;
      artist: string | null;
      track: string | null;
    }
  : {
      type: T;
    };

export type ExtendedSongProperties = {
  volume: number;
  rating: number;
  vote?: VoteType;
  startedAt: string | null;
};

export type PlayingSong<
  L extends Location,
  T extends SongType = SongType,
> = Song<L, T> &
  PlayingSongProperty<T> & {
    state: PlayState;
  } & ExtendedSongProperties;

export enum VoteType {
  UP = "UP",
  DOWN = "DOWN",
  NONE = "NONE",
}
