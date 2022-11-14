import { MumbleUser } from "types/auth";
import ee from "../../eventEmitter";
import { Message, MessageType } from "./types";

export const messages = new Array<Message>();

export const sendMessage = (
  content: string,
  options?: { user?: MumbleUser; type?: MessageType }
) => {
  const message = {
    id: Date.now().toString(),
    username: options?.user?.name ?? "Hande",
    content,
    timestamp: Date.now(),
    type: options?.type ?? MessageType.MESSAGE,
  };

  messages.concat(message).splice(-100);

  ee.emit(`onUpdate`, { message: { add: message } });

  return message;
};

export const sendErrorMessage = (content: string) => {
  sendMessage(content, { type: MessageType.ERROR });
};
