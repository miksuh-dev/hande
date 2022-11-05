import TextMessage from "../structures/TextMessage";
import AbstractHandler from "./AbstractHandler";

export interface TextMessageData {
  actor: number;
  channelId?: number[];
  message: string;
  session?: number[];
  treeId?: number[];
}

export default class TextMessageHandler extends AbstractHandler {
  override handle(data: TextMessageData) {
    console.log("data", data);
    const textMessage = new TextMessage(this.client, data);
    this.client.emit("message", textMessage);
  }
}
