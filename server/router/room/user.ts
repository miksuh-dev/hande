import { MumbleUser } from "types/auth";
import ee from "../../eventEmitter";
import { sendMessage } from "./message";
import { MessageType } from "./types";

interface UserOnline {
  clientIds: string[];
  user: MumbleUser;
}

// session id -> clientIds
export const users = new Map<number, UserOnline>();

export const join = (user: MumbleUser, clientId: string) => {
  const existing = users.get(user.session);

  if (!existing) {
    users.set(user.session, { user, clientIds: [clientId] });
    sendMessage(`liittyi huoneeseen.`, {
      type: MessageType.JOIN,
      user,
    });

    ee.emit(`onUpdate`, {
      user: { join: user },
    });
    return;
  }

  users.set(user.session, {
    ...existing,
    clientIds: [...existing.clientIds, clientId],
  });
};

export const leave = (user: MumbleUser, clientId: string) => {
  const existing = users.get(user.session);

  if (!existing) return;

  if (existing.clientIds.length === 1) {
    sendMessage(`poistui huoneesta.`, {
      type: MessageType.LEAVE,
      user,
    });

    ee.emit(`onUpdate`, {
      user: { leave: user.hash },
    });

    users.delete(user.session);

    return;
  }

  users.set(user.session, {
    ...existing,
    clientIds: existing.clientIds.filter((id) => id !== clientId),
  });
};

export const getTheme = (user: MumbleUser) => {
  return users.get(user.session)?.user.theme;
};

export const setTheme = (user: MumbleUser, theme: string) => {
  const existing = users.get(user.session);

  if (!existing) return;

  users.set(user.session, {
    ...existing,
    user: {
      ...existing.user,
      theme,
    },
  });

  return users.get(user.session)?.user;
};
