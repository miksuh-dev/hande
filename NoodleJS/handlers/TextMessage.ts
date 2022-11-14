import AbstractHandler from "./AbstractHandler"
import TextMessage from "../structures/TextMessage"

export default class TextMessageHandler extends AbstractHandler {
  handle(data: any) {
    const textMessage = new TextMessage(this.client, data)
    this.client.emit("message", textMessage)
  }
}
