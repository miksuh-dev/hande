import ee from "../../eventEmitter";
import { Message, MessageOptions, MessageType } from "./types";

export const messages = new Array<Message>();

const createMessage = (content: string, options?: MessageOptions): Message => {
  // User message
  if (options?.user) {
    const { property, state } = options.user;

    return {
      id: Date.now().toString(),
      name: options.user.name,
      userHash: options.user.hash,
      content,
      timestamp: Date.now(),
      type: options.type ?? MessageType.MESSAGE,
      property,
      state,
      ...(options.item && { item: options.item }),
      ...(options.count && { count: options.count }),
      ...(options.error && { error: options.error }),
    };
  }

  return {
    id: Date.now().toString(),
    name: process.env.MUMBLE_USERNAME ?? "System",
    content,
    timestamp: Date.now(),
    type: options?.type ?? MessageType.MESSAGE,
    property: {
      isSystem: true,
    },
    ...(options?.item && { item: options.item }),
    ...(options?.error && { error: options.error }),
  };
};

export const sendMessage = (content: string, options?: MessageOptions) => {
  const message = createMessage(content, options);

  messages.push(message);
  messages.splice(0, messages.length - 100);

  ee.emit(`onUpdate`, { message: { add: message } });

  return message;
};

export const sendErrorMessage = (
  content: string,
  options: MessageOptions = {}
) => {
  sendMessage(content, { type: MessageType.ERROR, ...options });
};
