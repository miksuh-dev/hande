import Client from "../index"
import TextMessage from "./TextMessage"

type UserProperties =
  | "session"
  | "name"
  | "mute"
  | "deaf"
  | "suppress"
  | "selfMute"
  | "selfDeaf"
  | "texture"
  | "pluginContext"
  | "pluginIdentity"
  | "comment"
  | "hash"
  | "commentHash"
  | "textureHash"
  | "prioritySpeaker"
  | "recording"

export default class User {
  session: any
  name: any
  mute: any
  deaf: any
  suppress: any
  selfMute: any
  selfDeaf: any
  texture: any
  pluginContext: any
  pluginIdentity: any
  comment: any
  hash: any
  commentHash: any
  textureHash: any
  prioritySpeaker: any
  recording: any
  id: any
  channel: any
  client: any
  actor: any

  constructor(client: Client, data: any) {
    Object.defineProperty(this, "client", { value: client })

    if (data) this.setup(data)
  }

  setup(data: any) {
    for (const prop of [
      "session",
      "name",
      "mute",
      "deaf",
      "suppress",
      "selfMute",
      "selfDeaf",
      "texture",
      "pluginContext",
      "pluginIdentity",
      "comment",
      "hash",
      "commentHash",
      "textureHash",
      "prioritySpeaker",
      "recording",
    ]) {
      if (data[prop] != null) {
        let typedProp = prop as UserProperties
        this[typedProp] = data[prop]
      }
    }

    if (data.userId != null) this.id = data.userId

    if (data.channelId != null) {
      this.channel = this.client.channels.get(data.channelId)
    } else {
      this.channel = this.client.channels.get(0)
    }

    if (data.actor != null) this.actor = this.client.users.get(data.actor)
  }

  sendMessage(message: any) {
    let textMessage = new TextMessage()
    textMessage.content = message

    textMessage.users.set(this.session, this)

    return this.client.connection
      .writeProto("TextMessage", textMessage.toPacket())
      .then(() => Promise.resolve(textMessage))
  }
}
