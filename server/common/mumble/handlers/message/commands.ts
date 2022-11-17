import generateToken from "./generateToken";
import help from "./help";
import { Message } from "./types";

export default [
  {
    command: "www",
    description: "Generoi liittymislinkin hallintapaneeliin.",
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
  action: (message: Message) => void | Promise<void>;
}[];
