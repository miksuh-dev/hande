import { EventEmitter } from "node:events";
import { Readable } from "node:stream";
import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";
import Connection from "mumble/Connection";
import Client from "../index";
import DispatchStream from "./DispatchStream";

export default class Dispatcher extends EventEmitter {
  client: Client;
  connection: Connection;
  dispatchStream: DispatchStream | undefined;
  command: FfmpegCommand | undefined;

  constructor(client: Client) {
    super();
    this.client = client;
    this.connection = this.client.connection;
  }

  playFile(filename: string, voiceTarget: number) {
    this.play(filename, voiceTarget);
  }

  playStream(stream: Readable, voiceTarget: number) {
    this.play(stream, voiceTarget);
  }

  play(stream: Parameters<typeof ffmpeg>[0], voiceTarget: number) {
    this.dispatchStream = new DispatchStream(this.connection, voiceTarget);
    console.log("this.dispatchStream", this.dispatchStream);
    this.dispatchStream.once("finish", () => {
      this.emit("end");
    });
    this.command = ffmpeg(stream)
      .output(this.dispatchStream)
      .audioFrequency(48000)
      .audioChannels(1)
      .audioBitrate(32)
      .format("s16le")
      .on("error", (e) => {
        this.emit("error", e);
      });
    this.command.run();
  }

  setVolume(volume: number) {
    if (!this.dispatchStream) {
      throw new Error("No dispatch stream");
    }
    this.dispatchStream.volume = volume;
  }

  getVolume() {
    if (!this.dispatchStream) {
      throw new Error("No dispatch stream");
    }

    return this.dispatchStream.volume;
  }

  stopStream() {
    if (this.dispatchStream) {
      this.dispatchStream.close();
    }
  }

  stop() {
    if (this.command) {
      // this.command.kill();
    }
  }
}
