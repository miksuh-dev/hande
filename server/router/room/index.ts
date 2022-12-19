import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import { getCurrentSong } from "../../common/playlist/internal";
import {
  addSong,
  playNext,
  removeSong,
  startPlay,
} from "../../common/playlist/user";
import ee from "../../eventEmitter";
import { t } from "../../trpc";
import { authedProcedure } from "../utils";
import { messages, sendMessage } from "./message";
import { searchFromSource, SOURCES } from "./sources";
import { MessageType, UpdateEvent } from "./types";
import * as userState from "./user";

export const roomRouter = t.router({
  get: authedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const playlist = await prisma.song.findMany({
      where: {
        ended: false,
        skipped: false,
        id: { not: getCurrentSong()?.id },
      },
      orderBy: [
        {
          position: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
    });

    return {
      playing: getCurrentSong(),
      songs: playlist,
      messages,
      users: [...userState.users.values()].map((u) => u.user),
      sources: SOURCES,
    };
  }),
  addSong: authedProcedure
    .input(
      z.object({
        url: z.string().min(1),
        contentId: z.string().min(1),
        title: z.string().min(1),
        thumbnail: z.string().nullable(),
        type: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;

      const { url, title, thumbnail, contentId } = input;

      const selectedType = SOURCES.find((s) => s.value === input.type)?.value;

      if (!selectedType) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid source",
        });
      }

      const song = await addSong(
        { url, contentId, title, thumbnail, type: selectedType },
        user
      );

      return song;
    }),
  removeSong: authedProcedure
    .input(
      z.object({
        id: z.number().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;
      try {
        const song = await removeSong(input.id, user);

        return { song };
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Song not found",
        });
      }
    }),
  playNext: authedProcedure
    .input(
      z.object({
        id: z.number().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;

      const song = await playNext(input.id, user);

      return { song };
    }),
  skipCurrent: authedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      if (input.id) {
        const song = await removeSong(input.id, user);

        return { song };
      }

      const song = await startPlay(user);

      return { song };
    }),
  search: authedProcedure
    .input(
      z.object({
        text: z.string().min(1),
        source: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const { text, source } = input;

      const selectedSource = SOURCES.find((s) => s.value === source);

      if (!selectedSource) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid source",
        });
      }

      return await searchFromSource(text, selectedSource);
    }),
  ping: authedProcedure.input(z.string().min(10)).mutation(({ input }) => {
    const pingTarget = input;

    ee.emit(`onPing-${pingTarget}`, "pong");

    return "pong";
  }),
  message: authedProcedure
    .input(
      z.object({
        content: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      const { user } = ctx;

      const message = sendMessage(input.content, {
        user,
        type: MessageType.MESSAGE,
      });

      return message;
    }),
  theme: authedProcedure
    .input(
      z.object({
        theme: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      const { user } = ctx;
      const { theme } = input;

      const updatedUser = userState.setTheme(user, theme);

      ee.emit(`onUpdate`, {
        user: { update: updatedUser },
      });

      return theme;
    }),
  onUpdate: authedProcedure
    .input(
      z.object({
        clientId: z.string().min(1),
        theme: z.string().min(1),
      })
    )
    .subscription(({ ctx, input }) => {
      const { user } = ctx;
      const { clientId, theme } = input;

      return observable<Partial<UpdateEvent>>((emit) => {
        const onUpdate = (updatedLobby: Partial<UpdateEvent>) => {
          emit.next(updatedLobby);
        };

        ee.on(`onUpdate`, onUpdate);

        const userWithTheme = { ...user, theme };
        userState.join(userWithTheme, clientId);

        return () => {
          userState.leave(user, clientId);

          ee.off(`onUpdate`, onUpdate);
        };
      });
    }),
  onPong: authedProcedure
    .input(
      z.object({
        clientId: z.string().min(1),
      })
    )
    .subscription(({ input }) => {
      const { clientId } = input;

      return observable<string>((emit) => {
        const onPong = (message: string) => {
          emit.next(message);
        };

        ee.on(`onPing-${clientId}`, onPong);

        return () => {
          ee.off(`onPing-${clientId}`, onPong);
        };
      });
    }),
});

export type RoomRouter = typeof roomRouter;
