import Client from "../index"
import Collection from "./Collection"

export default class TextMessage {
  users: Collection
  channels: Collection
  trees: Collection
  sender: any
  client?: Client
  content: any

  constructor(client?: Client, data?: any) {
    Object.defineProperty(this, "client", { value: client })

    this.users = new Collection()
    this.channels = new Collection()
    this.trees = new Collection()

    if (data) this.setup(data)
  }

  setup(data: any) {
    if (data.actor != null) this.sender = this.client?.users.get(data.actor)

    if (data.session != null)
      data.session.forEach((session: any) => {
        const user = this.client?.users.get(session)
        if (user) this.users.set(user.session, user)
      })

    if (data.channelId != null)
      data.channelId.forEach((id: any) => {
        const channel = this.client?.channels.get(id)
        if (channel) this.channels.set(channel.id, channel)
      })

    if (data.treeId != null)
      data.treeId.forEach((id: any) => {
        const channel = this.client?.channels.get(id)
        if (channel) this.trees.set(channel.id, channel)
      })

    if (data.message != null) this.content = data.message
  }

  reply(message: any) {
    return this.sender.sendMessage(message)
  }

  toPacket() {
    let packet: { message?: string; session?: Array<number>; channelId?: Array<number>; treeId?: Array<number> } = {}

    packet.message = this.content

    if (this.users.size) {
      packet.session = []
      for (const user of this.users.array()) {
        packet.session.push(Number(user.session))
      }
    }
    if (this.channels.size) {
      packet.channelId = []
      for (const channel of this.channels.array()) {
        packet.channelId.push(Number(channel.id))
      }
    }

    if (this.trees.size) {
      packet.treeId = []
      for (const channel of this.trees.array()) {
        packet.treeId.push(Number(channel.id))
      }
    }

    return packet
  }
}

module.exports = TextMessage
