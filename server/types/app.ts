import { Song } from "@prisma/client";
import { DateTime } from "luxon";

export type PlayingSong = Song & {
  startedAt: DateTime;
  endedAt?: DateTime;
};
