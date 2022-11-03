import { Song } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import {
  addSong,
  getCurrentSong,
  removeSong,
  skipCurrentSong,
} from "common/playlist";
import ee from "../../eventEmitter";
import { t } from "../../trpc";
import { MumbleUser } from "../../types/auth";
import { authedProcedure } from "../utils";

const roomOnlineUsers = new Map<string, MumbleUser[]>();
const roomMessages = new Map<string, Message[]>();

interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: number;
}

interface UpdateEvent {
  song: {
    add?: Song;
    remove?: Song["id"];
    setPlaying?: Song;
    skip?: Song["id"];
  };
  message: {
    add?: Message;
  };
  user: {
    join?: MumbleUser;
    leave?: MumbleUser["hash"];
  };
}

export const roomRouter = t.router({
  get: authedProcedure.query(async ({ ctx }) => {
    const { user, prisma } = ctx;

    const playlist = await prisma.song.findMany({
      where: {
        serverHash: ctx.user.serverHash,
        endedAt: null,
        id: {
          not: getCurrentSong(ctx.user.serverHash)?.id,
        },
      },
    });

    const users = roomOnlineUsers.get(user.serverHash) ?? [];
    const messages = roomMessages.get(user.serverHash) ?? [];

    return {
      playing: getCurrentSong(user.serverHash),
      songs: playlist,
      messages,
      users,
    };
  }),
  addSong: authedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        thumbnail: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;

      const { id, title, thumbnail } = input;

      const song = await addSong(
        { id, title, thumbnail },
        user.serverHash,
        user
      );

      ee.emit(`onUpdate-${user.serverHash}`, { song: { add: song } });

      return { song };
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
        const song = await removeSong(input.id, user.serverHash);

        ee.emit(`onUpdate-${user.serverHash}`, { song: { remove: song.id } });

        return { song };
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Song not found",
        });
      }
    }),
  skipSong: authedProcedure
    .input(
      z.object({
        id: z.number().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx;
      try {
        const currentSong = getCurrentSong(user.serverHash);
        if (!currentSong) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "No song is playing",
          });
        }

        const newSong = await skipCurrentSong(input.id, user.serverHash);

        ee.emit(`onUpdate-${user.serverHash}`, {
          song: { skip: currentSong.id, setPlaying: newSong },
        });

        return { song: currentSong };
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Song not found",
        });
      }
    }),
  message: authedProcedure
    .input(
      z.object({
        content: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      const { user } = ctx;

      const message = {
        id: Date.now().toString(),
        username: user.name,
        content: input.content,
        timestamp: Date.now(),
      };

      ee.emit(`onUpdate-${user.serverHash}`, { message: { add: message } });

      return message;
    }),
  onUpdate: authedProcedure.subscription(({ ctx }) => {
    const { user } = ctx;

    return observable<Partial<UpdateEvent>>((emit) => {
      const onUpdate = (updatedLobby: Partial<UpdateEvent>) => {
        emit.next(updatedLobby);
      };

      ee.on(`onUpdate-${user.serverHash}`, onUpdate);

      const users = roomOnlineUsers.get(user.serverHash) ?? [];
      roomOnlineUsers.set(user.serverHash, [...users, user]);

      ee.emit(`onUpdate-${user.serverHash}`, {
        user: { join: user },
      });

      return () => {
        roomOnlineUsers.delete(user.serverHash);

        ee.emit(`onUpdate-${user.serverHash}`, {
          user: { leave: user.hash },
        });

        ee.off(`onUpdate-${user.serverHash}`, onUpdate);
      };
    });
  }),
});

export type RoomRouter = typeof roomRouter;
