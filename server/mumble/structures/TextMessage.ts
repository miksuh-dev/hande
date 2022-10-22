import { TextMessageData } from "mumble/handlers/TextMessage";
import Client from "../index";
import Channel from "./Channel";
import User from "./User";

export default class TextMessage {
  users: Map<number, User>;
  channels: Map<number, Channel>;
  trees: Map<number, Channel>;
  sender: User | undefined;
  client?: Client;
  content: TextMessageData["message"];

  constructor(client?: Client, data?: TextMessageData) {
    Object.defineProperty(this, "client", { value: client });

    this.users = new Map();
    this.channels = new Map();
    this.trees = new Map();
    this.content = "";

    if (data) this.setup(data);
  }

  setup(data: TextMessageData) {
    this.sender = this.client?.users.get(data.actor);

    if (data.session != undefined)
      data.session.forEach((session) => {
        const user = this.client?.users.get(session);
        if (user) this.users.set(user.session, user);
      });

    if (data.channelId != undefined)
      data.channelId.forEach((id) => {
        const channel = this.client?.channels.get(id);
        if (channel) this.channels.set(channel.id, channel);
      });

    if (data.treeId != undefined)
      data.treeId.forEach((id) => {
        const channel = this.client?.channels.get(id);
        if (channel) this.trees.set(channel.id, channel);
      });

    this.content = data.message;
  }

  reply(message: string) {
    if (!this.sender) {
      throw new Error("Cannot reply to a message with no sender");
    }
    return this.sender.sendMessage(message);
  }

  toPacket() {
    const packet = {
      message: "",
      session: [],
      channelId: [],
      treeId: [],
    } as {
      message: string;
      session: number[];
      channelId: number[];
      treeId: number[];
    };

    packet.message = this.content;

    if (this.users.size) {
      packet.session = [];
      for (const user of this.users.values()) {
        packet.session.push(user.session);
      }
    }
    if (this.channels.size) {
      packet.channelId = [];
      for (const channel of this.channels.values()) {
        packet.channelId.push(channel.id);
      }
    }

    if (this.trees.size) {
      packet.treeId = [];
      for (const channel of this.trees.values()) {
        packet.treeId.push(channel.id);
      }
    }

    return packet;
  }
}
