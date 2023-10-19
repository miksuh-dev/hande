import { DateTime } from "luxon";
import { Song } from "./prisma";

export type PlayingSong = Song & {
  startedAt: DateTime;
  endedAt?: DateTime;
  duration?: number;
  rating: number;
  vote?: VoteType | undefined;
  originalRequester?: string;
  volume: number;
};

export enum VoteType {
  UP = "UP",
  DOWN = "DOWN",
  NONE = "NONE",
}
