import ee from "../../eventEmitter";
import { Message, MessageOptions, MessageType } from "./types";

export const messages = new Array<Message>();

const createMessage = (content: string, options?: MessageOptions): Message => {
  // User message
  return options?.user
    ? {
        id: Date.now().toString(),
        name: options.user.name,
        userHash: options.user.hash,
        content,
        timestamp: Date.now(),
        type: options.type ?? MessageType.MESSAGE,
        isSystem: false,
        isMumbleUser: options.user.isMumbleUser,
      }
    : // System message
      {
        id: Date.now().toString(),
        name: process.env.MUMBLE_USERNAME ?? "System",
        content,
        timestamp: Date.now(),
        type: options?.type ?? MessageType.MESSAGE,
        isSystem: true,
      };
};

export const sendMessage = (content: string, options?: MessageOptions) => {
  const message = createMessage(content, options);

  messages.push(message);
  messages.splice(0, messages.length - 100);

  ee.emit(`onUpdate`, { message: { add: message } });

  return message;
};

export const sendErrorMessage = (content: string) => {
  sendMessage(content, { type: MessageType.ERROR });
};
