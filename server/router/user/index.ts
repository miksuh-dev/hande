import crypto from "crypto";
import { TRPCError } from "@trpc/server";
import { DateTime } from "luxon";
import { z } from "zod";
import { t } from "../../trpc";
import { createSession, verifyJWTToken } from "../../utils/auth";
import { userProcedure, guestProcedure } from "../utils";

export const userRouter = t.router({
  me: userProcedure.query(({ ctx }) => {
    const { user } = ctx;
    return user;
  }),
  login: t.procedure.input(z.string().min(1)).mutation(({ input }) => {
    const user = verifyJWTToken(input);

    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid token",
      });
    }

    return { user };
  }),
  register: guestProcedure
    .input(
      z.object({
        name: z.string().min(1),
      })
    )
    .mutation(({ input }) => {
      const session = {
        session: DateTime.utc().toMillis(),
        name: input.name,
        hash: crypto.createHash("sha512").digest("hex"),
        isGuest: false,
        isMumbleUser: false,
      };

      return createSession(session);
    }),
});

export type UserRouter = typeof userRouter;
