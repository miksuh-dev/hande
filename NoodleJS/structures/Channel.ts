import Promise from "bluebird"
import Client from "../index"
import Collection from "./Collection"
import TextMessage from "./TextMessage"

/**
 * Represents a channel on Mumble
 */
export default class Channel {
  children: Collection
  links: Collection
  id: any
  parent: any
  client: any
  name: any
  description: any
  temporary: any
  position: any

  /**
   * @param  {Client} client The client that instantiated the channel
   * @param  {ChannelData} data Information about the channel
   */
  constructor(client: Client, data: any) {
    Object.defineProperty(this, "client", { value: client })

    this.children = new Collection()
    this.links = new Collection()

    if (data) this.setup(data)
  }

  setup(data: any) {
    if (data.channelId == null) return

    this.id = data.channelId
    if (data.parent != null) {
      if (this.parent) {
        if (this.parent.id !== data.parent) {
          this.parent.children.delete(this.id)
          this.parent = this.client.channels.get(data.parent)
          this.parent.children.set(this.id, this)
        }
      } else {
        this.parent = this.client.channels.get(data.parent)
        this.parent.children.set(this.id, this)
      }
    }

    if (data.name != null) this.name = data.name

    if (data.links != null)
      data.links.forEach((val: any) => {
        const channel = this.client.channels.get(val)
        if (channel) this.links.set(channel.id, channel)
      })

    if (data.description != null) this.description = data.description

    if (data.linksAdd != null)
      data.linksAdd.forEach((val: any) => {
        const channel = this.client.channels.get(val)
        if (channel) this.links.set(channel.id, channel)
      })

    if (data.linksRemove != null)
      data.linksRemove.forEach((val: any) => {
        const channel = this.client.channels.get(val)
        if (channel) this.links.delete(channel.id)
      })

    if (data.temporary != null) this.temporary = data.temporary

    if (data.position != null) this.position = data.position
  }

  sendMessage(message: any, recursive: any) {
    let textMessage = new TextMessage()
    textMessage.content = message

    if (recursive) {
      textMessage.trees.set(this.id, this)
    } else {
      textMessage.channels.set(this.id, this)
    }

    return this.client.connection
      .writeProto("TextMessage", textMessage.toPacket())
      .then(() => Promise.resolve(textMessage))
  }
}
