import crypto from "crypto";
import { createSession } from "../../../../utils/auth";
import { Message } from "../../client/types";

const handleGenerateToken = (message: Message) => {
  const { sender } = message;

  if (!sender) {
    console.log("no sender");
    return;
  }

  const serverUrl = message.client?.connection.options.url;
  const serverPort = message.client?.connection.options.port;

  if (!serverUrl) throw new Error("No url");
  if (!serverPort) throw new Error("No port");

  const serverHash = crypto
    .createHash("sha512")
    .update(`${serverUrl}${serverPort}`, "utf-8")
    .digest("hex");

  const token = createSession({
    session: sender.session,
    name: sender.name || "Nimetön",
    hash: sender.hash,
    serverHash,
  });

  const basePath = process.env.WWW_BASE_PATH;
  if (!basePath) {
    throw new Error("No base path");
  }

  const formattedToken = token.replace(/\./g, "%2E");

  const url = `<a href="${basePath}?token=${formattedToken}">tästä<a/>`;

  message.reply(`Siirry hallintapaneeliin ${url}.`);
};

export default handleGenerateToken;
