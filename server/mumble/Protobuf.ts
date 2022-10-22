import * as path from "path";
import protobufjs from "protobufjs";
import Messages from "./Messages";

class Protobuf {
  mumble: protobufjs.Root | undefined;

  async load() {
    const root = await protobufjs.load(path.join(__dirname, "Mumble.proto"));

    this.mumble = root;

    return this;
  }

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

  decodePacket(type_id: number, buffer: protobufjs.Reader | Uint8Array) {
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
    return Messages[id];
  }

  idByName(name: string) {
    for (const key in Messages) {
      if (Messages[key] === name) {
        return Number(key);
      }
    }

    return undefined;
  }
}

export default Protobuf;
