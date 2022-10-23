import Message from "./structures/TextMessage";

export { Message };

export enum Event {
  "data" = "data",
  "ready" = "ready",
  "message" = "message",
  "error" = "error",
}
