import Promise from "bluebird"
import * as path from "path"
import Messages from "./Messages"
import protobufjs from "protobufjs"

class Protobuf {
  mumble: any

  load = (): globalThis.Promise<this> => {
    return protobufjs
      .load(path.join(__dirname, "Mumble.proto"))
      .then((root: any) => {
        this.mumble = root
        return Promise.resolve(this)
      })
      .catch((err: any) => {
        console.error(err)
        throw new Error(err)
      })
  }

  encodePacket(type: any, payload: any) {
    const packet = this.mumble.lookup(`MumbleProto.${type}`)
    if (packet.verify(payload)) throw new Error(`Error verifying payload for packet ${type}`)
    const message = packet.create(payload)
    return packet.encode(message).finish()
  }

  decodePacket(type_id: any, buffer: any) {
    const type = this.nameById(type_id)
    const packet = this.mumble.lookup(`MumbleProto.${type}`)
    return packet.decode(buffer).toJSON()
  }

  nameById(id: number) {
    return Messages[id] as any
  }

  idByName(name: string) {
    for (const key in Messages) {
      if (Messages[key] == name) return key
    }
  }
}

export default Protobuf
