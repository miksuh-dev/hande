import generateToken from "./generateToken";
import help from "./help";
import { Message } from "./types";
import { serverLanguage } from "../../../../languages";

export default [
  {
    command: serverLanguage.commands.www.command,
    description: serverLanguage.commands.www.description,
    action: generateToken,
  },
  {
    command: serverLanguage.commands.help.command,
    description: serverLanguage.commands.www.description,
    action: help,
  },
] as {
  command: string;
  description: string;
  action: (message: Message) => void | Promise<void>;
}[];
