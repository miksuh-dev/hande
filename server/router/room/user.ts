import { MumbleUser } from "types/auth";
import ee from "../../eventEmitter";
import { sendMessage } from "./message";
import { MessageType } from "./types";

export const users = new Array<MumbleUser>();

export const userJoin = (user: MumbleUser) => {
  if (!users.some((u) => u.hash === user.hash)) {
    users.push(user);

    sendMessage(`Käyttäjä ${user.name} liittyi huoneeseen`, {
      user,
      type: MessageType.MESSAGE,
    });

    ee.emit(`onUpdate`, {
      user: { join: user },
    });
  }
};

export const userLeave = (user: MumbleUser) => {
  users.filter((u) => u.hash !== user.hash);

  sendMessage(`Käyttäjä ${user.name} poistui huoneesta`, {
    user,
    type: MessageType.MESSAGE,
  });

  ee.emit(`onUpdate`, {
    user: { leave: user.hash },
  });
};
