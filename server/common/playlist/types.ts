import { Song } from "@prisma/client";
import { PlayingSong } from "types/app";

export interface PlayError {
  id: number;
  retryCount: number;
}

export enum ProcessQueueItemStatus {
  pending = "pending",
  processing = "processing",
  skipped = "skipped",
  error = "error",
  done = "done",
}

interface NonActiveItem {
  status:
    | ProcessQueueItemStatus.pending
    | ProcessQueueItemStatus.error
    | ProcessQueueItemStatus.skipped;
  song: Song;
}

interface ActiveItem {
  status: ProcessQueueItemStatus.processing;
  song: PlayingSong;
}

export type ProcessQueueItem = (NonActiveItem | ActiveItem) & {
  retryCount: number;
  callback: () => Promise<void>;
};
