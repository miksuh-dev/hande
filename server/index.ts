import fs from "fs";
import http from "http";
import * as trpcExpress from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import "dotenv/config";
import express from "express";
import ws from "ws";
import { createContext } from "./context";
import handleMessage from "./handlers/message";
import NoodleJS from "./mumble";
import { appRouter, AppRouter } from "./router";

try {
  // const YoutubeDlWrap = require("youtube-dl-wrap");
  // const youtubeDlWrap = new YoutubeDlWrap("/usr/bin/youtube-dl");
  //

  const options = {
    url: process.env.MUMBLE_ADDRESS,
    port: process.env.MUMBLE_PORT,
    name: process.env.MUMBLE_USERNAME,
    password: process.env.MUMBLE_PASSWORD,
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem"),
    // rejectUnauthorized: true,
  };

  const client = new NoodleJS(options);
  // console.log("client", client);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // client.on("read", handleReady.bind(this));
  // client.on("ready", (info: Client) => {
  // console.log("info", info);
  // client.sendMessage("asd", false);
  // });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client.on("data", (data: any) => {
    console.log("data", data);
  });

  client.on("message", handleMessage.bind(this));
  // try {
  //   console.log("message", message);
  //   if (message.content === "ping") {
  //     await message.reply("pong");
  //   }
  //
  //   try {
  //     const readStream = youtubeDlWrap.execStream([
  //       "https://www.youtube.com/watch?v=MV_3Dpw-BRY",
  //       "-f",
  //       "best",
  //     ]) as Readable;
  //
  //     client.voiceConnection.playStream(readStream, 0);
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // } catch (error) {
  //   console.log("error", error);
  // }
  // const filehandle = fs.createReadStream("myfile.opus");
  // client.voiceConnection.playStream(filehandle);
  // filehandle.on("end", function () {
  //   console.log("fuck");
  // });
  //
  // client.voiceConnection.playFile(
  //   "/home/miksuh/Projects/personal/hande/villielain.mp3"
  // );
  // }
  // });

  // client.on(
  //   "message",
  //   (message: { content: string; reply: (arg0: string) => void }) => {
  //     if (message.content === "ping") {
  //       message.reply("pong");
  //     }
  //   }
  // );

  client.on("error", (error: unknown) => {
    console.log("error", error);
    throw error;
    // client.sendMessage("Mumble error:");
    // client.sendMessage(error);
    // console.log(error);
    // client.reconnect();
  });

  client.connect();
} catch (err) {
  console.log(err);
}

const app = express();
const server = http.createServer(app);

// ws server
const wss = new ws.Server({ server });
const wsHandler = applyWSSHandler<AppRouter>({
  wss,
  router: appRouter,
  createContext,
});

app.use((req, res, next) => {
  // TODO: Fix these at some point
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  console.log("⬅️ ", req.method, req.path, req.body ?? req.query);

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  next();
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.use(express.static("client/build"));
app.use("/images", express.static("client/build/images"));
app.use("/assets", express.static("client/build/assets"));
app.get("*", (_, res) => {
  res.sendFile("index.html", {
    root: "client/build",
  });
});

const port = 2021;
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on("error", console.error);
//
wss.on("connection", () => {
  console.log(`Connection (${wss.clients.size})`);
});

process.on("SIGTERM", () => {
  wsHandler.broadcastReconnectNotification();
  wss.close();
  server.close();
});
