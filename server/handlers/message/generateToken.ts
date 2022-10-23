import crypto from "crypto";
import { Message } from "../../mumble/types";
import { createSession } from "../../utils/auth";

const handleGenerateToken = (message: Message) => {
  const { sender } = message;
  console.log("message", message);

  if (!sender) {
    throw new Error("No sender");
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
    name: sender.name,
    hash: sender.hash,
    serverHash,
  });

  console.log("token", token);

  const basePath = process.env.WWW_BASE_PATH;
  if (!basePath) {
    throw new Error("No base path");
  }

  const formattedToken = token.replace(/\./g, "%2E");
  console.log("formattedToken", formattedToken);

  const url = `<a href="${basePath}?token=${formattedToken}">tästä<a/>`;

  message.reply(`Siirry hallintapaneeliin ${url}.`);
};

export default handleGenerateToken;
