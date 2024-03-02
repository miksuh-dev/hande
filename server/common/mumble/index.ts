/* eslint-disable @typescript-eslint/no-unsafe-call */
import fs from "fs";
import NoodleJS from "@noodlejs";
import handleMessage from "./handlers/message";
import ee from "../../eventEmitter";

const clientOptions = !process.env.LOCAL
  ? {
      key: fs.readFileSync("./key.pem"),
      cert: fs.readFileSync("./cert.pem"),
    }
  : {};

const client = new NoodleJS({
  url: process.env.MUMBLE_ADDRESS,
  port: Number(process.env.MUMBLE_PORT),
  name: process.env.MUMBLE_USERNAME,
  password: process.env.MUMBLE_PASSWORD,
  ...clientOptions,
});

client.on("message", handleMessage.bind(this));

client.on("data", (data: unknown) => {
  console.log(data);
});

client.on("error", (error: unknown) => {
  console.log("error", error);
  ee.emit("onError", error);
});

client.connection.on("close", () => {
  throw new Error("Mumble client closed connection");
});

client.connect().catch((e: unknown) => {
  console.log("e", e);
});

export default client;
