import { Message } from "../../client/types";
import commands from "./commands";

const handleGenerateToken = (message: Message) => {
  let content = "<br /><b>Käytössä olevat komennot:</b><br /><br />";

  commands.forEach((command) => {
    content += `<i>${command.command}</i> - ${command.description}<br />`;
  });

  message.reply(content);
};

export default handleGenerateToken;
