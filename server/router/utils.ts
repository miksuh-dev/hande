import { TRPCError } from "@trpc/server";
import prisma from "../prisma";
import { t } from "../trpc";

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (ctx.user.property.isGuest) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.user,
      prisma: prisma,
    },
  });
});

const isUser = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.user,
      prisma: prisma,
    },
  });
});

const isOnlineUser = t.middleware(({ next, ctx }) => {
  if (!ctx.onlineUser) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.user,
      onlineUser: ctx.onlineUser,
      prisma: prisma,
    },
  });
});

const isGuest = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (!ctx.user.property.isGuest) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.user,
      prisma: prisma,
    },
  });
});

export const authedProcedure = t.procedure.use(isAuthed);
export const userProcedure = t.procedure.use(isUser);
export const onlineUserProcedure = t.procedure.use(isOnlineUser);
export const guestProcedure = t.procedure.use(isGuest);
