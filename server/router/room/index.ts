// import { TRPCError } from "@trpc/server";
import { Song } from "@prisma/client";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
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

interface Room {
  song: Song[];
  users: MumbleUser[];
  messages: Message[];
}

export const roomRouter = t.router({
  get: authedProcedure.query(async ({ ctx }) => {
    const { user, prisma } = ctx;

    const songs = await prisma.song.findMany({
      where: {
        serverHash: user.serverHash,
      },
    });

    const users = roomOnlineUsers.get(user.serverHash) ?? [];
    const messages = roomMessages.get(user.serverHash) ?? [];

    return {
      songs,
      messages,
      users,
    };
  }),
  message: authedProcedure
    .input(
      z.object({
        content: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      const { user } = ctx;

      const message = [
        {
          id: Date.now().toString(),
          username: user.name,
          content: input.content,
          timestamp: Date.now(),
        },
      ];

      ee.emit(`onUpdate-${user.serverHash}`, { messages: message });

      return message;
    }),
  onUpdate: authedProcedure.subscription(({ ctx }) => {
    const { user } = ctx;

    return observable<Partial<Room>>((emit) => {
      const onUpdate = (updatedLobby: Partial<Room>) => {
        emit.next(updatedLobby);
      };

      ee.on(`onUpdate-${user.serverHash}`, onUpdate);

      const users = roomOnlineUsers.get(user.serverHash) ?? [];
      roomOnlineUsers.set(user.serverHash, [...users, user]);

      ee.emit(`onUpdate-${user.serverHash}`, {
        users: roomOnlineUsers.get(user.serverHash) ?? [],
      });

      return () => {
        roomOnlineUsers.delete(user.serverHash);

        ee.emit(`onUpdate-${user.serverHash}`, {
          users: roomOnlineUsers.get(user.serverHash) ?? [],
        });

        ee.off(`onUpdate-${user.serverHash}`, onUpdate);
      };
    });
  }),
});

export type RoomRouter = typeof roomRouter;
