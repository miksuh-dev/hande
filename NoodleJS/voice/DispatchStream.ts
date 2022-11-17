import { EventEmitter } from "node:events";
import Connection from "../Connection";
const WritableStream = require("stream").Writable;
// const EventEmitter = require("events").EventEmitter;
const Constants = require("../Constants");

export default class DispatchStream extends WritableStream {
  connection: Connection;
  processObserver: EventEmitter;
  frameQueue: Buffer[];
  lastFrame: Buffer;
  whisperId: number;
  lastFrameWritten: number;
  lastWrite: number | undefined;
  processInterval: ReturnType<typeof setInterval> | undefined;
  voiceSequence = 0;

  _volume: number;

  constructor(connection: Connection, voiceTarget: any) {
    super();
    this.connection = connection;
    this.processObserver = new EventEmitter();

    this.open();

    this.frameQueue = [];
    this.lastFrame = this._createFrameBuffer();

    this.whisperId = voiceTarget;

    this._volume = 1;
    this.lastFrameWritten = 0;
    this.lastWrite = undefined;
  }

  open() {
    if (this.processInterval) return;
    this.processInterval = setInterval(
      this._processAudioBuffer.bind(this),
      Constants.Audio.frameLength
    );
  }

  close() {
    if (this.processInterval) clearInterval(this.processInterval);
    this.processInterval = undefined;
    this.frameQueue = [];
    this.lastFrame = this._createFrameBuffer();
    this.lastFrameWritten = 0;
    this.lastWrite = undefined;
  }

  set volume(volume) {
    this._volume = volume;
  }

  get volume() {
    return this._volume;
  }

  applyFrameVolume(frame: any, gain: any) {
    for (var i = 0; i < frame.length; i += 2) {
      frame.writeInt16LE(Math.floor(frame.readInt16LE(i) * gain), i);
    }
    return frame;
  }

  _createFrameBuffer() {
    return Buffer.alloc(Constants.Audio.frameSize * 2);
  }

  _processAudioBuffer() {
    if (!this.connection) return;

    if (
      !this.lastWrite ||
      this.lastWrite + 20 * Constants.Audio.frameLength < Date.now()
    ) {
      this.voiceSequence = this.connection.voiceSequence;
      this.lastWrite = Date.now();
      return;
    }

    while (this.lastWrite + Constants.Audio.frameLength < Date.now()) {
      if (this.frameQueue.length > 0) {
        let frame = this.frameQueue.shift();

        if (this._volume !== 1) {
          frame = this.applyFrameVolume(frame, this._volume);
        }

        if (this.frameQueue.length < 1) {
          this.voiceSequence += this.connection.writeAudio(
            frame,
            this.whisperId,
            this.connection.codec,
            this.voiceSequence,
            true
          );
        } else {
          this.voiceSequence += this.connection.writeAudio(
            frame,
            this.whisperId,
            this.connection.codec,
            this.voiceSequence,
            false
          );
        }
        this.processObserver.emit("written");
      }

      this.lastWrite += Constants.Audio.frameLength;
    }

    return;
  }

  _write(chunk: any, encoding: any, next: any) {
    while (true) {
      if (this.frameQueue.length >= Constants.Audio.frameLength) {
        this.processObserver.once("written", () => {
          this._write(chunk, encoding, next);
        });
        return;
      }

      const writtenBefore = this.lastFrameWritten;
      chunk.copy(this.lastFrame, this.lastFrameWritten, 0);
      let written = writtenBefore + chunk.length;

      if (written >= this.lastFrame.length) {
        written = this.lastFrame.length;
        this.frameQueue.push(this.lastFrame);
        this.lastFrame = this._createFrameBuffer();
        this.lastFrameWritten = 0;
      } else {
        this.lastFrameWritten = written;
      }

      if (chunk.length > written - writtenBefore) {
        chunk = chunk.slice(written - writtenBefore);
      } else {
        return next();
      }
    }
  }
}

module.exports = DispatchStream;
