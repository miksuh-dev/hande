import { RoomClient } from "@server/common/room";
import { Location, PlayingSong } from "@server/types/app";
import { OnlineUser } from "@server/types/auth";
import { Song } from "@server/types/prisma";
import { SourceType } from "@server/types/source";

export enum MessageType {
  MESSAGE = "MESSAGE",
  ACTION = "ACTION",
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  ERROR = "ERROR",
}

export interface MessageOptions<L extends Location> {
  user?: OnlineUser;
  type?: MessageType;
  item?: Song<L>[];
  error?: string;
}

interface SystemMessage<L extends Location> {
  id: string;
  name: string;
  content: string;
  item?: Song<L>[];
  error?: string;
  timestamp: number;
  type: MessageType;
  property: {
    isSystem: true;
  };
}

export type UserMessage<L extends Location> = Omit<
  SystemMessage<L>,
  "property"
> & {
  // extends SystemMessage<L>{}
  userHash: string;
  property: OnlineUser["property"];
  state: OnlineUser["state"];
};

export type Message<L extends Location> = SystemMessage<L> | UserMessage<L>;

export interface UpdateEvent<L extends Location> {
  song?: {
    add?: Song<L>[];
    remove?: Song<L>["id"][];
    setPlaying?: PlayingSong<L>;
    update?: Song<L>[];
    skip?: Song<L>["id"];
  };
  message?: {
    add?: Message<L>;
  };
  user?: {
    join?: OnlineUser;
    leave?: OnlineUser["hash"];
    update?: OnlineUser;
  };
  room?: RoomClient;
}

interface SourceResult {
  contentId: string;
  title: string;
  description: string;
  thumbnail: string | null;
  url: string;
}

export interface SourceResultSong extends SourceResult {
  thumbnail: string;
  type: SourceType.SONG;
}

export interface SourceResultPlaylist extends SourceResult {
  thumbnail: string;
  type: SourceType.PLAYLIST;
}

export interface SourceResultRadio extends SourceResult {
  thumbnail: null;
  type: SourceType.RADIO;
}

export type SourceResultSongOrRadio = SourceResultSong | SourceResultRadio;
