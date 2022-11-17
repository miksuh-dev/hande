import * as path from "path";
import protobufjs from "protobufjs";
import Messages from "./Messages";

class Protobuf {
  mumble: protobufjs.Root | undefined;

  async load() {
    return await protobufjs
      .load(path.join(__dirname, "Mumble.proto"))
      .then((root) => {
        this.mumble = root;

        return Promise.resolve(this);
      })
      .catch((err: any) => {
        console.log();
        throw err;
      });
  }
  // load = (): globalThis.Promise<this> => {
  //   return protobufjs
  //     .load(path.join(__dirname, "Mumble.proto"))
  //     .then((root) => {
  //       this.mumble = root
  //       return Promise.resolve(this)
  //     })
  //     .catch((err: any) => {
  //       console.error(err)
  //       throw new Error(err)
  //     })
  // }
  //
  encodePacket(type: number | string, payload: Record<string, unknown>) {
    if (!this.mumble) {
      throw new Error("Protobuf not loaded");
    }

    const packet = this.mumble.lookupType(`MumbleProto.${type}`);

    if (packet.verify(payload)) {
      throw new Error(`Error verifying payload for packet ${type}`);
    }
    const message = packet.create(payload);
    return packet.encode(message).finish();
  }

  decodePacket(type_id: any, buffer: any) {
    if (!this.mumble) {
      throw new Error("Protobuf not loaded");
    }
    const type = this.nameById(type_id);
    if (!type) {
      throw new Error(`Unknown packet type: ${type_id}`);
    }
    const packet = this.mumble.lookupType(`MumbleProto.${type}`);
    return packet.decode(buffer).toJSON();
  }

  nameById(id: number) {
    return Messages[id] as any;
  }

  idByName(name: string) {
    for (const key in Messages) {
      if (Messages[key] == name) return key;
    }
  }
}

export default Protobuf;
