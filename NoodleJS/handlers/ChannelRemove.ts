import AbstractHandler from "./AbstractHandler"

export default class ChannelRemove extends AbstractHandler {
  handle(data: any) {
    let channel = this.client.channels.get(data.channelId)

    if (channel) {
      this.client.channels.delete(channel.id)
      if (this.client.synced) this.client.emit("channelRemove", channel.id)
    }
  }
}
