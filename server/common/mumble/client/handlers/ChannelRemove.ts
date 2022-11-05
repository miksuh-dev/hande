import AbstractHandler from "./AbstractHandler";

export interface ChannelRemoveData {
  channelId: number;
}

export default class ChannelRemove extends AbstractHandler {
  override handle(data: ChannelRemoveData) {
    const channel = this.client.channels.get(data.channelId);

    if (!channel?.id) {
      throw new Error("Channel not found");
    }

    this.client.channels.delete(channel.id);
    if (this.client.synced) this.client.emit("channelRemove", channel.id);
  }
}
