import { Song } from "@prisma/client";
import { SearchResultThumbnail } from "common/youtube";
import { PlayingSong } from "types/app";
import { OnlineUser } from "types/auth";
import { SOURCES } from "./sources";

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
  item?: string;
  error?: string;
  count?: number;
}

interface SystemMessage {
  id: string;
  name: string;
  content: string;
  item?: string;
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
  thumbnail: SearchResultThumbnail | null;
  url: string;
}

export interface SourceResultSong extends SourceResult {
  thumbnail: SearchResultThumbnail;
  type: "song";
}

export interface SourceResultPlaylist extends SourceResult {
  thumbnail: SearchResultThumbnail;
  type: "playlist";
}

export interface SourceResultRadio extends SourceResult {
  thumbnail: null;
  type: "radio";
}
