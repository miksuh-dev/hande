import { MumbleUser } from "types/auth";
import ee from "../../eventEmitter";
import { sendMessage } from "./message";
import { MessageType } from "./types";

export const users = new Array<MumbleUser>();

export const userJoin = (user: MumbleUser) => {
  if (!users.some((u) => u.hash === user.hash)) {
    users.push(user);

    sendMessage(`Käyttäjä ${user.name} liittyi huoneeseen.`, {
      type: MessageType.MESSAGE,
    });

    ee.emit(`onUpdate`, {
      user: { join: user },
    });
  }
};

export const userLeave = (user: MumbleUser) => {
  const index = users.findIndex((u) => u.hash === user.hash);
  if (index !== -1) {
    users.splice(index, 1);
  }

  sendMessage(`Käyttäjä ${user.name} poistui huoneesta.`, {
    type: MessageType.MESSAGE,
  });

  ee.emit(`onUpdate`, {
    user: { leave: user.hash },
  });
};
