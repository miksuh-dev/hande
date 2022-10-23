import { EventEmitter } from "events";
import * as tls from "tls";
import { OpusEncoder } from "@discordjs/opus";
import * as Constants from "./Constants";
import { ClientOptions } from "./index";
import Protobuf from "./Protobuf";
import * as Util from "./Util";

class Connection extends EventEmitter {
  options: ClientOptions;
  opusEncoder: OpusEncoder;
  currentEncoder: OpusEncoder;
  voiceSequence: number;
  codec: number;
  codecWarningShown: Record<number, number>;
  protobuf: Protobuf | undefined;
  socket: tls.TLSSocket | undefined;

  constructor(options: ClientOptions) {
    super();

    this.options = options;
    this.opusEncoder = new OpusEncoder(Constants.Audio.sampleRate, 1);
    this.opusEncoder.setBitrate(70000); // Hard-coded for now
    this.currentEncoder = this.opusEncoder;
    this.codec = Connection.codec().Opus;
    this.voiceSequence = 0;
    this.codecWarningShown = {};
  }

  connect() {
    new Protobuf()
      .load()
      .then((protobuf) => {
        this.protobuf = protobuf;
        this.socket = tls.connect(
          this.options.port,
          this.options.url,
          this.options,
          () => {
            this.emit("connected");
          }
        );
        this.socket.on("error", (error) => {
          this.emit("error", error);
        });
        this.socket.on("data", this._onReceiveData.bind(this));
      })
      .catch((error) => {
        this.emit("error", error);
      });
  }

  close() {
    if (this.socket) {
      this.socket.end();
    }
  }

  static codec() {
    return {
      Celt: 0,
      Ping: 1,
      Speex: 2,
      CeltBeta: 3,
      Opus: 4,
    };
  }

  _onReceiveData(data: Buffer) {
    while (data.length > 6) {
      const type = data.readUInt16BE(0);
      const length = data.readUInt32BE(2);
      if (data.length < length + 6) break;
      const buf = data.subarray(6, length + 6);
      data = data.subarray(buf.length + 6);
      this._processData(type, buf);
    }
  }

  _processData(type: number, data: Buffer) {
    if (!this.protobuf) {
      throw new Error("Protobuf not loaded");
    }

    if (this.protobuf.nameById(type) === "UDPTunnel") {
      this.readAudio(data);
    } else {
      const msg = this.protobuf.decodePacket(type, data);
      this._processMessage(type, msg);
    }
  }

  _processMessage(type: number, msg: unknown) {
    if (!this.protobuf) {
      throw new Error("Protobuf not loaded");
    }
    const typeName = this.protobuf.nameById(type);
    if (!typeName) {
      throw new Error("Unknown channel");
    }

    console.log("type", type);
    console.log("msg", msg);
    console.log("typeName", typeName);
    console.log("---");

    this.emit(typeName, msg);
  }

  _writePacket(buffer: Uint8Array) {
    if (this.socket) {
      this.socket.write(buffer);
    }
  }

  _writeHeader(type: number, data: number) {
    const header = Buffer.alloc(6);
    header.writeUInt16BE(type, 0);
    header.writeUInt32BE(data, 2);
    this._writePacket(header);
  }

  writeProto(type: string, data: Record<string, unknown>) {
    try {
      if (!this.protobuf) {
        throw new Error("Protobuf not loaded");
      }

      const packet = this.protobuf.encodePacket(type, data);

      const id = this.protobuf.idByName(type);
      if (id === undefined) {
        throw new Error("Unknown channel");
      }

      this._writeHeader(id, packet.length);
      this._writePacket(packet);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  readAudio(data: Buffer) {
    // Packet format:
    // https://github.com/mumble-voip/mumble-protocol/blob/master/voice_data.rst#packet-format
    if (!data[0]) {
      throw new Error("Invalid packet");
    }

    const audioType = (data[0] & 0xe0) >> 5;
    const audioTarget = data[0] & 0x1f;

    if (audioType == Connection.codec().Ping) {
      // Nothing to do but don't display a warning
      console.log("Audio PING packet received");
      return;
    } else if (audioType > 4) {
      // We don't know what type this is
      console.warn(`Unknown audioType in packet detected: ${audioType}`);
      return;
    }

    // It's an "Encoded audio data packet" (CELT Alpha, Speex, CELT Beta
    // or Opus). So it's safe to parse the header

    // Offset in data from where we are currently reading
    let offset = 1;

    let varInt = Util.fromVarInt(data.subarray(offset, offset + 9));
    const sender = varInt.value;
    offset += varInt.consumed;

    varInt = Util.fromVarInt(data.subarray(offset, offset + 9));
    const sequence = varInt.value;
    offset += varInt.consumed;

    if (audioType != Connection.codec().Opus) {
      // Not OPUS-encoded => not supported :/
      // Check if we already printed a warning for this audiostream

      const warning = this.codecWarningShown[sender];

      if (!warning || warning < sequence) {
        // sequence < this.codecWarningShown[sender])
        console.warn(
          `Unspported audio codec in voice stream from user ${sender} : ", ${audioType}`
        );
        this.codecWarningShown[sender] = sequence;
        return;
      }
    }

    // Opus header
    varInt = Util.fromVarInt(data.subarray(offset, offset + 9));
    offset += varInt.consumed;
    const opusHeader = varInt.value;

    const opusLength = opusHeader & 0x1fff;
    const lastFrame = opusHeader & 0x2000 ? true : false;

    const opusData = data.subarray(offset, offset + opusLength);

    const decoded = this.currentEncoder.decode(opusData);
    //console.debug("\tDECODED DATA LENGTH:" + decoded.length + ' DATA:', decoded);

    const voiceData = {
      audioType: audioType, // For the moment, will be 4 = OPUS
      whisperTarget: audioTarget,
      sender: sender, // Session ID of the user sending the audio
      sequence: sequence,
      lastFrame: lastFrame, // Don't rely on it!
      opusData: opusData, // Voice data encoded, as it came in
      decodedData: decoded, // Voice data decoded (48000, 1ch, 16bit)
    };

    this.emit("voiceData", voiceData);
  }

  writeAudio(
    packet: Buffer,
    whisperTarget: number,
    codec: number,
    voiceSequence: number,
    final: boolean
  ) {
    if (!this.protobuf) {
      throw new Error("Protobuf not loaded");
    }

    packet = this.currentEncoder.encode(packet);

    const type = codec === Connection.codec().Opus ? 4 : 0;
    const target = whisperTarget || 0;
    const typeTarget = (type << 5) | target;

    if (typeof voiceSequence !== "number") voiceSequence = this.voiceSequence;

    const sequenceVarint = Util.toVarint(voiceSequence);

    const voiceHeader = Buffer.alloc(1 + sequenceVarint.length);
    voiceHeader[0] = typeTarget;
    sequenceVarint.value.copy(voiceHeader, 1, 0);
    let header;

    if (codec == Connection.codec().Opus) {
      if (packet.length > 0x1fff)
        throw new TypeError(
          `Audio frame too long! Max Opus length is ${0x1fff} bytes.`
        );

      let headerValue = packet.length;

      if (final) headerValue += 1 << 7;

      const headerVarint = Util.toVarint(headerValue);
      header = headerVarint.value;
    } else {
      throw new TypeError("Celt is not supported");
    }

    const frame = Buffer.alloc(header.length + packet.length);
    header.copy(frame, 0);

    packet.copy(frame, header.length);

    voiceSequence++;

    const id = this.protobuf.idByName("UDPTunnel");
    if (id === undefined) {
      throw new Error("Unknown channel");
    }

    this._writeHeader(id, voiceHeader.length + frame.length);
    this._writePacket(voiceHeader);
    this._writePacket(frame);

    if (voiceSequence > this.voiceSequence) this.voiceSequence = voiceSequence;

    return 1;
  }
}

export default Connection;
