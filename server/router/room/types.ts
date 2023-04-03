import { Song } from "@prisma/client";
import { PlayingSong } from "types/app";
import { OnlineUser } from "types/auth";
import { SOURCES, SourceType } from "./sources";

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
  item?: Song;
  error?: string;
  count?: number;
}

interface SystemMessage {
  id: string;
  name: string;
  content: string;
  item?: Song;
  count?: number;
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
}

export type Source = typeof SOURCES[number];

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
