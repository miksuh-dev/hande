// import http from "http";
import { IncomingMessage } from "http";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import ws from "ws";
import { getUserFromRequest } from "./utils/auth";

export const createContext = ({
  res,
  req,
}:
  | CreateExpressContextOptions
  | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) => {
  const url = req.url ?? "";
  const user = getUserFromRequest(req.headers, url);

  return {
    user,
    req,
    res,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
