import { BASE } from "../../../../constants";
import commands from "./commands";
import { Message } from "./types";

const baseHandler = new Map(commands.map((c) => [c.command, c.action]));

const handleMessage = (message: Message) => {
  void (async function (): Promise<void> {
    if (message.content.startsWith(BASE)) {
      const action = message.content.slice(BASE.length);

      const handler = baseHandler.get(action);
      if (handler) {
        await handler(message);

        return;
      }

      const content = `Tuntematon komento ${action}. Lähetä "hande apua" nähdäksesi komennot.`;
      if (message.sender) {
        await message.reply(content);
      } else if (message.client?.user?.channel) {
        await message.client.user.channel.sendMessage(content, false);
      }
    }
  })().catch((e) => {
    console.log("e", e);
  });
};

export default handleMessage;
