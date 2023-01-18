import crypto from "crypto";
import { TRPCError } from "@trpc/server";
import { DateTime } from "luxon";
import { z } from "zod";
import { OnlineUser } from "types/auth";
import { schemaForType } from "utils/trpc";
import ee from "../../eventEmitter";
import { t } from "../../trpc";
import {
  createSession,
  getSessionVersion,
  verifyJWTToken,
} from "../../utils/auth";
import { userProcedure, guestProcedure, onlineUserProcedure } from "../utils";
import * as userState from "./state";

export const userRouter = t.router({
  me: userProcedure.query(({ ctx }) => {
    const { user } = ctx;
    return user;
  }),
  login: t.procedure.input(z.string().min(1)).mutation(({ input }) => {
    const user = verifyJWTToken(input);

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "error.tokenExpired",
      });
    }

    if (!user.version || user.version < getSessionVersion().major) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "error.oldVersion",
      });
    }

    return user;
  }),
  register: guestProcedure
    .input(
      z.object({
        name: z.string().min(1),
      })
    )
    .mutation(({ input }) => {
      const sessionId = DateTime.utc().toMillis();

      const session = {
        session: sessionId,
        name: input.name,
        hash: crypto
          .createHash("sha512")
          .update(`${input.name}-${sessionId.toString()}`)
          .digest("hex"),
        property: {
          isGuest: false,
          isMumbleUser: false,
        },
        version: getSessionVersion().major,
      };

      return createSession(session);
    }),
  updateState: onlineUserProcedure
    .input(
      schemaForType<OnlineUser["state"]>()(
        z.object({
          theme: z.string(),
        })
      )
    )
    .mutation(({ ctx, input }) => {
      const { onlineUser } = ctx;
      const { theme } = input;

      const updatedUser = userState.setState(onlineUser, "theme", theme);

      ee.emit(`onUpdate`, {
        user: { update: updatedUser },
      });

      return theme;
    }),
});

export type UserRouter = typeof userRouter;
