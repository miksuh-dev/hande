import { BASE } from "../../../../constants";
import { Message } from "../../client/types";
import commands from "./commands";

const baseHandler = new Map(commands.map((c) => [c.command, c.action]));

const handleMessage = (message: Message) => {
  if (message.content.startsWith(BASE)) {
    const action = message.content.slice(BASE.length);

    const handler = baseHandler.get(action);
    if (handler) {
      handler(message);

      return;
    }

    message.reply(
      `Tuntematon komento ${action}. Lähetä "hande apua" nähdäksesi komennot.`
    );
  }
};

export default handleMessage;
