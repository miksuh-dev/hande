import fs from "fs";
import { DateTime } from "luxon";
import ee from "@server/eventEmitter";
import { Server } from "@server/types/app";
import { Message, MessageOptions, MessageType } from "./types";

const HISTORY_FILE = "message-history.json";

export const store = () => {
  const data = JSON.stringify(messages);

  console.log(`Saved ${messages.length} messages to ${HISTORY_FILE}`);

  return fs.writeFileSync(HISTORY_FILE, data);
};

export const load = () => {
  try {
    const content = fs.readFileSync(HISTORY_FILE, "utf-8");

    const data = JSON.parse(content, (key: unknown, value: unknown) => {
      if (key === "createdAt") {
        return DateTime.fromISO(value as string, { zone: "utc" }).toJSDate();
      }

      return value;
    }) as Message<Server>[];

    console.log(`Loaded ${data.length} messages from ${HISTORY_FILE}`);

    messages.unshift(...data);
  } catch (e) {
    console.log(`No message history found in ${HISTORY_FILE}`);
  }
};

export const messages = new Array<Message<Server>>();

const createMessage = (
  content: string,
  options?: MessageOptions<Server>
): Message<Server> => {
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
      ...(options.error && { error: options.error }),
      ...(options.statistics && { statistics: options.statistics }),
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

export const sendMessage = (
  content: string,
  options?: MessageOptions<Server>
) => {
  const message = createMessage(content, options);

  const messageLimit = process.env.CHAT_MESSAGE_LIMIT ?? 100;

  messages.push(message);
  messages.splice(0, messages.length - Number(messageLimit));

  ee.emit(`onUpdate`, { message: { add: message } });

  return message;
};

export const sendErrorMessage = (
  content: string,
  options: MessageOptions<Server> = {}
) => {
  sendMessage(content, { type: MessageType.ERROR, ...options });
};
