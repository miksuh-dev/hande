import Client from "../index";

const EventEmitter = require("events").EventEmitter;
const DispatchStream = require("./DispatchStream");
const ffmpeg = require("fluent-ffmpeg");

export default class Dispatcher extends EventEmitter {
  constructor(client: Client) {
    super();
    this.client = client;
    this.connection = this.client.connection;
  }

  playFile(filename: string, voiceTarget: string) {
    return this.play(filename, voiceTarget);
  }

  playStream(stream: any, voiceTarget: string) {
    return this.play(stream, voiceTarget);
  }

  play(unknown: any, voiceTarget: any) {
    try {
      this.dispatchStream = new DispatchStream(this.connection, voiceTarget);
      this.dispatchStream.on("finish", () => {
        this.emit("end");
      });

      this.command = ffmpeg(unknown)
        .output(this.dispatchStream)
        .audioFrequency(48000)
        .audioChannels(1)
        .format("s16le");

      this.command.run();

      return this.command;
    } catch (e) {
      console.log("e", e);
    }
  }

  setVolume(volume: number) {
    this.dispatchStream.volume = volume;
  }

  getVolume() {
    return this.dispatchStream.volume;
  }

  stopStream() {
    if (this.dispatchStream) this.dispatchStream.close();
  }

  stop() {
    if (this.command) this.command.kill();
  }
}
