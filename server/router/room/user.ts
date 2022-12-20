import { MumbleUser } from "types/auth";
import ee from "../../eventEmitter";
import { sendMessage } from "./message";
import { MessageType } from "./types";

interface UserOnline {
  clientIds: string[];
  user: MumbleUser;
}

// session id -> clientIds
export const users = new Map<string, UserOnline>();

export const join = (user: MumbleUser, clientId: string) => {
  const existing = users.get(user.hash);

  if (!existing) {
    users.set(user.hash, { user, clientIds: [clientId] });
    sendMessage("chat.message.joined", {
      type: MessageType.JOIN,
      user,
    });

    ee.emit(`onUpdate`, {
      user: { join: user },
    });
    return;
  }

  users.set(user.hash, {
    ...existing,
    clientIds: [...existing.clientIds, clientId],
  });
};

export const leave = (user: MumbleUser, clientId: string) => {
  const existing = users.get(user.hash);

  if (!existing) return;

  if (existing.clientIds.length === 1) {
    sendMessage("chat.message.left", {
      type: MessageType.LEAVE,
      user,
    });

    ee.emit(`onUpdate`, {
      user: { leave: user.hash },
    });

    users.delete(user.hash);

    return;
  }

  users.set(user.hash, {
    ...existing,
    clientIds: existing.clientIds.filter((id) => id !== clientId),
  });
};

export const getTheme = (user: MumbleUser) => {
  return users.get(user.hash)?.user.theme;
};

export const setTheme = (user: MumbleUser, theme: string) => {
  const existing = users.get(user.hash);

  if (!existing) return;

  users.set(user.hash, {
    ...existing,
    user: {
      ...existing.user,
      theme,
    },
  });

  return users.get(user.hash)?.user;
};
