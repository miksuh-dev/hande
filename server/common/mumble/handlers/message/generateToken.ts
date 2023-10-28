import { DateTime } from "luxon";
import { serverLanguage } from "@server/languages";
import { createSession, getServerVersion } from "@server/utils/auth";
import { Message } from "./types";

const t = serverLanguage.commands.www;

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
        version: getServerVersion().major,
        property: {
          isGuest: false,
          isMumbleUser: true,
        },
      }
    : {
        session: DateTime.utc().toMillis(),
        name: "Guest",
        hash: "",
        version: getServerVersion().major,
        property: {
          isGuest: true,
          isMumbleUser: false,
        },
      };

  const token = createSession(session);

  const tokenUrl = process.env.TOKEN_URL;
  if (!tokenUrl) {
    throw new Error("No base path");
  }

  const formattedToken = token.replace(/\./g, "%2E");

  const url = `<a href="${tokenUrl}?login=${formattedToken}">${t.here}<a/>`;

  if (hasSender) {
    await message.reply(t.reply(url));
  } else {
    await message.client?.user?.channel?.sendMessage(t.replyGuest(url), false);
  }
};

export default handleGenerateToken;
