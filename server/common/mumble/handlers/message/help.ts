import { serverLanguage } from "../../../../languages";
import commands from "./commands";
import { Message } from "./types";

const t = serverLanguage.commands.help;

const handleGenerateToken = async (message: Message) => {
  let content = `<br /><b>${t.header}:</b><br /><br />`;

  commands.forEach((command) => {
    content += `<i>${command.command}</i> - ${command.description}<br />`;
  });

  content += `<br />${t.wipCaution}`;

  if (message.sender) {
    await message.reply(content);
  } else if (message.client?.user?.channel) {
    await message.client.user.channel.sendMessage(content, false);
  }
};

export default handleGenerateToken;
