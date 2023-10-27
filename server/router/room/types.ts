import { RoomClient } from "common/room";
import { PlayingSong } from "types/app";
import { OnlineUser } from "types/auth";
import { Song } from "types/prisma";
import { SourceType } from "../../types/source";

export enum MessageType {
  MESSAGE = "MESSAGE",
  ACTION = "ACTION",
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  ERROR = "ERROR",
}

export interface MessageOptions {
  user?: OnlineUser;
  type?: MessageType;
  item?: Song[];
  error?: string;
}

interface SystemMessage {
  id: string;
  name: string;
  content: string;
  item?: Song[];
  error?: string;
  timestamp: number;
  type: MessageType;
  property: {
    isSystem: true;
  };
}

export interface UserMessage extends Omit<SystemMessage, "property"> {
  userHash: string;
  property: OnlineUser["property"];
  state: OnlineUser["state"];
}

export type Message = SystemMessage | UserMessage;

export interface UpdateEvent {
  song: {
    add?: Song[];
    remove?: Song["id"][];
    setPlaying?: PlayingSong;
    update?: Song[];
    skip?: Song["id"];
  };
  message: {
    add?: Message;
  };
  user: {
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
