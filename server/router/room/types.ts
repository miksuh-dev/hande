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
export interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: number;
  type: MessageType;
  isSystem: boolean;
}

export interface UpdateEvent {
  song: {
    add?: Song;
    remove?: Song["id"];
    setPlaying?: PlayingSong;
    skip?: Song["id"];
  };
  message: {
    add?: Message;
  };
  user: {
    join?: MumbleUser;
    leave?: MumbleUser["hash"];
  };
}
