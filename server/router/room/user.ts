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

const handleLeaveTimeout = (user: MumbleUser) => {
  const existing = users.get(user.hash);
  const clientIds = existing?.clientIds ?? [];

  if (clientIds.length === 0) {
    sendMessage("chat.message.left", {
      type: MessageType.LEAVE,
      user,
    });

    ee.emit(`onUpdate`, {
      user: { leave: user.hash },
    });

    users.delete(user.hash);
  }
};

export const leave = (user: MumbleUser, clientId: string) => {
  const existing = users.get(user.hash);
  if (!existing) return;

  const clientIds = existing.clientIds.filter((id) => id !== clientId);

  if (clientIds.length === 0) {
    setTimeout(() => {
      handleLeaveTimeout(user);
    }, 5000);
  }

  users.set(user.hash, {
    ...existing,
    clientIds,
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
