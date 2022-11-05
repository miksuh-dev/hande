import { ChannelStateData } from "../handlers/ChannelState";
import Client from "../index";
import TextMessage from "./TextMessage";

/**
 * Represents a channel on Mumble
 */
export default class Channel {
  children: Map<number, Channel>;
  links: Map<number, Channel>;
  id: number;
  parent: Channel | undefined;
  client: Client;
  name: string | undefined;
  description: string | undefined;
  temporary: boolean | undefined;
  position: number | undefined;
  linksAdd: number[] | undefined;
  linksRemove: number[] | undefined;

  /**
   * @param  {Client} client The client that instantiated the channel
   * @param  {ChannelData} data Information about the channel
   */
  constructor(client: Client, data: ChannelStateData) {
    // Object.defineProperty(this, "client", { value: client });
    this.client = client;

    this.children = new Map();
    this.links = new Map();

    this.id = data.channelId;

    /* if (data) */ this.setup(data);
  }

  setup(data: ChannelStateData) {
    this.id = data.channelId;

    if (data.parent != undefined) {
      if (this.parent != undefined) {
        if (this.parent.id !== data.parent) {
          this.parent.children.delete(this.id);
        }
      }

      this.parent = this.client.channels.get(data.parent);
      if (this.parent !== undefined) {
        this.parent.children.set(this.id, this);
      }
    }

    if (data.name != null) this.name = data.name;

    if (data.links != null)
      data.links.forEach((val) => {
        const channel = this.client.channels.get(val);
        if (channel) this.links.set(channel.id, channel);
      });

    if (data.description != null) this.description = data.description;

    if (data.linksAdd != null)
      data.linksAdd.forEach((val) => {
        const channel = this.client.channels.get(val);
        if (channel) this.links.set(channel.id, channel);
      });

    if (data.linksRemove != null)
      data.linksRemove.forEach((val) => {
        const channel = this.client.channels.get(val);
        if (channel) this.links.delete(channel.id);
      });

    if (this.temporary != null) this.temporary = data.temporary;
    if (this.position != null) this.position = data.position;
  }

  sendMessage(message: string, recursive: boolean) {
    const textMessage = new TextMessage(this.client);
    textMessage.content = message;

    if (recursive) {
      textMessage.trees.set(this.id, this);
    } else {
      textMessage.channels.set(this.id, this);
    }

    return this.client.connection.writeProto(
      "TextMessage",
      textMessage.toPacket()
    );
  }
}
