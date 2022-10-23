import { BASE } from "../../constants";
// import { BASE, ACTION } from "../constants";
import { Message } from "../../mumble/types";
import ACTION from "./action";
import generateToken from "./generateToken";

const baseHandler = new Map([[ACTION.GENERATE_TOKEN, generateToken]]);

const handleMessage = (message: Message) => {
  if (message.content.startsWith(BASE)) {
    const action = message.content.slice(BASE.length);

    const handler = baseHandler.get(action);
    if (handler) {
      handler(message);

      return;
    }

    throw new Error(`Unknown command ${action}`);
  }
};

export default handleMessage;
