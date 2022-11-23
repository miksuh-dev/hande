import { DateTime } from "luxon";
import { createSession } from "../../../../utils/auth";
import { Message } from "./types";

const handleGenerateToken = async (message: Message) => {
  const { sender } = message;

  const serverUrl = message.client?.connection.options.url;
  const serverPort = message.client?.connection.options.port;

  if (!serverUrl) throw new Error("No url");
  if (!serverPort) throw new Error("No port");

  const hasSender = sender?.name;

  const session = hasSender
    ? {
        session: sender.session,
        name: sender.name,
        hash: sender.hash,
        isGuest: false,
        isMumbleUser: true,
      }
    : {
        session: DateTime.utc().toMillis(),
        name: "Guest",
        hash: "",
        isGuest: true,
        isMumbleUser: false,
      };

  const token = createSession(session);

  const tokenUrl = process.env.TOKEN_URL;
  if (!tokenUrl) {
    throw new Error("No base path");
  }

  const formattedToken = token.replace(/\./g, "%2E");

  const url = `<a href="${tokenUrl}?login=${formattedToken}">tästä<a/>`;

  if (hasSender) {
    await message.reply(`Siirry hallintapaneeliin ${url}.`);
  } else {
    await message.client?.user?.channel?.sendMessage(
      `Siirry hallintapaneeliin vieraana ${url}.`,
      false
    );
  }
};

export default handleGenerateToken;
