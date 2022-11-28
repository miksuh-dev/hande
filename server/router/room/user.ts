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

export const userJoin = (user: MumbleUser, clientId: string) => {
  const existing = users.get(user.session);

  if (!existing) {
    users.set(user.session, { user, clientIds: [clientId] });
    sendMessage(`Käyttäjä ${user.name} liittyi huoneeseen.`, {
      type: MessageType.MESSAGE,
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

export const userLeave = (user: MumbleUser, clientId: string) => {
  const existing = users.get(user.session);

  if (!existing) return;

  if (existing.clientIds.length === 1) {
    sendMessage(`Käyttäjä ${user.name} poistui huoneesta.`, {
      type: MessageType.MESSAGE,
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
