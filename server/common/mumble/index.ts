import fs from "fs";
import {
  getCurrentSong,
  getNextSong,
  playSong,
} from "common/playlist/internal";
import NoodleJS from "./client";
import handleMessage from "./handlers/message";

const options = {
  url: process.env.MUMBLE_ADDRESS,
  port: process.env.MUMBLE_PORT,
  name: process.env.MUMBLE_USERNAME,
  password: process.env.MUMBLE_PASSWORD,
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

const client = new NoodleJS(options);

client.on("message", handleMessage.bind(this));

client.on("ready", () => {
  void (async () => {
    const currentSong = getCurrentSong();
    if (!currentSong) {
      const nextSong = await getNextSong();

      if (nextSong) {
        playSong(nextSong);
      }
    }
  })();
});

client.on("error", (error: unknown) => {
  console.log("error", error);
});

client.connect();

export default client;
