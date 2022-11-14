import { Message } from "../../client/types";
import generateToken from "./generateToken";
import help from "./help";

export default [
  {
    command: "www",
    description: "Generoi käyttäjälle tokenin hallintapaneeliin.",
    action: generateToken,
  },
  {
    command: "apua",
    description: "Näyttää komennot.",
    action: help,
  },
] as {
  command: string;
  description: string;
  action: (message: Message) => void;
}[];
