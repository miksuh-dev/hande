import commands from "./commands";
import { Message } from "./types";

const handleGenerateToken = async (message: Message) => {
  let content = "<br /><b>Käytössä olevat komennot:</b><br /><br />";

  commands.forEach((command) => {
    content += `<i>${command.command}</i> - ${command.description}<br />`;
  });

  content +=
    "<br />Huom! Handen yksityisviestit toimivat vain jos käyttäjällä ei ole (liian pitkää) kommenttia ";

  if (message.sender) {
    await message.reply(content);
  } else if (message.client?.user?.channel) {
    await message.client.user.channel.sendMessage(content, false);
  }
};

export default handleGenerateToken;
