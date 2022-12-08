import { Song } from "@prisma/client";
import { PlayingSong } from "types/app";
import { MumbleUser } from "types/auth";

export enum MessageType {
  MESSAGE = "MESSAGE",
  ACTION = "ACTION",
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  ERROR = "ERROR",
}

export interface MessageOptions {
  user?: MumbleUser;
  type?: MessageType;
}

interface SystemMessage {
  id: string;
  name: string;
  content: string;
  timestamp: number;
  type: MessageType;
  isSystem: true;
}

export type UserMessage = Omit<SystemMessage, "isSystem"> & {
  userHash: string;
  isSystem: false;
  isMumbleUser: boolean;
  theme: string;
};

export type Message = SystemMessage | UserMessage;

export interface UpdateEvent {
  song: {
    add?: Song;
    remove?: Song["id"];
    setPlaying?: PlayingSong;
    update?: Song;
    skip?: Song["id"];
  };
  message: {
    add?: Message;
  };
  user: {
    join?: MumbleUser;
    leave?: MumbleUser["hash"];
    update?: MumbleUser;
  };
}
