import { getSongSettings } from "@server/common/playlist/internal";
import { ExtendedSongProperties, PlayingSong, Server } from "../../types/app";
import { Song } from "../../types/prisma";

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

export interface NonActiveItem {
  status:
    | ProcessQueueItemStatus.pending
    | ProcessQueueItemStatus.error
    | ProcessQueueItemStatus.skipped;
  song: Song<Server> & ExtendedSongProperties;
}

export interface ActiveItem {
  status: ProcessQueueItemStatus.processing;
  song: PlayingSong<Server> & ExtendedSongProperties;
}

export type ProcessQueueItem = (NonActiveItem | ActiveItem) & {
  retryCount: number;
  callback: () => Promise<void>;
};

export type Options = Awaited<ReturnType<typeof getSongSettings>>;
