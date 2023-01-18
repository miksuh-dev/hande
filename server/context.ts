import { IncomingMessage } from "http";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import ws from "ws";
import prisma from "./prisma";
import * as userState from "./router/user/state";
import { getUserFromRequest } from "./utils/auth";

export const createContext = ({
  res,
  req,
}:
  | CreateExpressContextOptions
  | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) => {
  const url = req.url ?? "";
  const user = getUserFromRequest(req.headers, url);

  const onlineUser = user ? userState.users.get(user.hash)?.user : undefined;

  return {
    user,
    onlineUser,
    req,
    res,
    prisma,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
