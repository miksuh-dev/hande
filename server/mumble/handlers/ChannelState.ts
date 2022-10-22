import Channel from "../structures/Channel";
import AbstractHandler from "./AbstractHandler";

export interface ChannelStateData {
  channelId: number;
  parent?: number;
  name?: string;
  position?: number;
  maxUsers: number;
  links?: number[];
  description?: string;
  linksAdd?: number[];
  linksRemove?: number[];
  temporary?: boolean;
  descriptionHash?: string;
  isEnterRestricted?: boolean;
  canEnter?: boolean;
}

export default class ChannelState extends AbstractHandler {
  override handle(data: ChannelStateData) {
    let channel = this.client.channels.get(data.channelId);

    if (channel) {
      const oldChannel = { ...channel };
      channel.setup(data);
      if (this.client.synced)
        this.client.emit("channelUpdate", oldChannel, channel);
    } else {
      channel = new Channel(this.client, data);
      if (this.client.synced) this.client.emit("channelCreate", channel);
    }

    this.client.channels.set(channel.id, channel);
  }
}
