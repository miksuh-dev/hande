import * as room from "@server/common/room";
import ee from "@server/eventEmitter";
import { MumbleUser, OnlineUser } from "@server/types/auth";
import { sendMessage } from "../room/message";
import { MessageType } from "../room/types";

interface OnlineUserState {
  clientIds: string[];
  user: OnlineUser;
}

// session id -> clientIds
export const users = new Map<string, OnlineUserState>();

const isEmptyRoom = () => users.size === 0;

export const join = (user: OnlineUser, clientId: string) => {
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

const handleLeaveTimeout = (user: OnlineUser) => {
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

    if (isEmptyRoom()) onEmptyRoom();
  }
};

export const leave = (user: MumbleUser, clientId: string) => {
  const existing = users.get(user.hash);
  if (!existing) return;

  const clientIds = existing.clientIds.filter((id) => id !== clientId);

  if (clientIds.length === 0) {
    setTimeout(() => {
      handleLeaveTimeout(existing.user);
    }, 5000);
  }

  users.set(user.hash, {
    ...existing,
    clientIds,
  });
};

export function setState<T extends keyof OnlineUser["state"]>(
  user: OnlineUser,
  state: T,
  value: OnlineUser["state"][T]
) {
  const existing = users.get(user.hash);

  if (!existing) return;

  users.set(user.hash, {
    ...existing,
    user: {
      ...existing.user,
      state: {
        ...existing.user.state,
        [state]: value,
      },
    },
  });

  return users.get(user.hash)?.user;
}

const onEmptyRoom = () => {
  if (room.get().autoplay) {
    room.onAutoplayExpire("emptyRoom");
  }
};
