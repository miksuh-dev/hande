import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import { getCurrentSong } from "../../common/playlist/internal";
import { addSong, removeSong, startPlay } from "../../common/playlist/user";
import ee from "../../eventEmitter";
import { t } from "../../trpc";
import { authedProcedure } from "../utils";
import { messages, sendMessage } from "./message";
import { MessageType, UpdateEvent } from "./types";
import { users, userJoin, userLeave } from "./user";

export const roomRouter = t.router({
  get: authedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const playlist = await prisma.song.findMany({
      where: {
        ended: false,
        skipped: false,
        id: { not: getCurrentSong()?.id },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      playing: getCurrentSong(),
      songs: playlist,
      messages,
      users,
    };
  }),
  addSong: authedProcedure
    .input(
      z.object({
        videoId: z.string().min(1),
        title: z.string().min(1),
        thumbnail: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;

      const { videoId, title, thumbnail } = input;

      const song = await addSong({ videoId, title, thumbnail }, user);

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
  ping: authedProcedure.mutation(({ ctx }) => {
    const { user } = ctx;

    ee.emit(`onPing-${user.session}`, "pong");

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
  onUpdate: authedProcedure.subscription(({ ctx }) => {
    const { user } = ctx;

    return observable<Partial<UpdateEvent>>((emit) => {
      const onUpdate = (updatedLobby: Partial<UpdateEvent>) => {
        emit.next(updatedLobby);
      };

      ee.on(`onUpdate`, onUpdate);

      userJoin(user);

      return () => {
        userLeave(user);

        ee.off(`onUpdate`, onUpdate);
      };
    });
  }),
  onPong: authedProcedure.subscription(({ ctx }) => {
    const { user } = ctx;

    return observable<string>((emit) => {
      const onPong = (message: string) => {
        emit.next(message);
      };

      ee.on(`onPing-${user.session}`, onPong);

      return () => {
        ee.on(`onPing-${user.session}`, onPong);
      };
    });
  }),
});

export type RoomRouter = typeof roomRouter;
