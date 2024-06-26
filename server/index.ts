import http from "http";
import * as trpcExpress from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import "dotenv/config";
import express from "express";
import { Settings } from "luxon";
import ws from "ws";
import client from "./common/mumble";
import { createContext } from "./context";
import { appRouter, AppRouter } from "./router";
import * as messages from "./router/room/message";

Settings.throwOnInvalid = true;

declare module "luxon" {
  interface TSSettings {
    throwOnInvalid: true;
  }
}

client.on("ready", () => {
  console.log("ready");
});

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
  if (process.env.LOCAL === "true") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Authorization"
    );
  }

  const proto = req.headers["x-forwarded-proto"];
  if (proto && proto === "http") {
    // redirect to ssl
    res.writeHead(303, {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      location: `https://${req.headers.host}${req.headers.url ?? ""}`,
    });
    res.end();
    return;
  }

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

app.use(express.static("dist/client"));
app.use("/images", express.static("dist/client/images"));
app.use("/assets", express.static("dist/client/assets"));
app.get("*", (_, res) => {
  res.sendFile("index.html", {
    root: "dist/client",
  });
});

const port = process.env.PORT ?? 2021;
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on("error", console.error);
//
wss.on("connection", () => {
  console.log(`Connection (${wss.clients.size})`);
});

const gracefulShutdown = () => {
  // Store messages
  messages.store();

  wsHandler.broadcastReconnectNotification();
  wss.close();
  server.close();

  setTimeout(() => {
    process.exit(0);
  }, 2000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

messages.load();
