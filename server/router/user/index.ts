import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { t } from "../../trpc";
import { verifyJWTToken } from "../../utils/auth";
import { authedProcedure } from "../utils";

export const userRouter = t.router({
  me: authedProcedure.query(({ ctx }) => {
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
});

export type UserRouter = typeof userRouter;
