import { DateTime } from "luxon";
import { Song } from "./prisma";

export type PlayingSong = Song & {
  startedAt: DateTime;
  endedAt?: DateTime;
  duration?: number;
};
