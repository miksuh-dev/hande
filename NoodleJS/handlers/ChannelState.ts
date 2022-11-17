import Channel from "../structures/Channel";
import Util from "../Util";
import AbstractHandler from "./AbstractHandler";

export default class ChannelState extends AbstractHandler {
  handle(data: any) {
    let channel = this.client.channels.get(data.channelId);

    if (channel) {
      const oldChannel = Util.cloneObject(channel);
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
