// import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import ee from "../../eventEmitter";
import { t } from "../../trpc";
import { authedProcedure } from "../utils";

interface Message {
  id: string;
  username: string;
  content: string;
  timestamp: number;
}

export const roomRouter = t.router({
  get: authedProcedure.query(async ({ ctx }) => {
    const { user, prisma } = ctx;

    const songs = await prisma.song.findMany({
      where: {
        serverHash: user.serverHash,
      },
    });

    return {
      songs,
      messages: [],
      users: [],
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

      const message = {
        id: Date.now().toString(),
        username: user.name,
        content: input.content,
        timestamp: Date.now(),
      };

      ee.emit(`onMessage-${user.serverHash}`, message);

      return message;
    }),
  // onUpdate: authedProcedure.subscription(({ input, ctx }) => {
  //   const { user } = ctx;
  //
  //   return observable<Partial<LobbyState>>((emit) => {
  //     const onUpdate = (updatedLobby: Partial<LobbyState>) => {
  //       emit.next(updatedLobby);
  //     };
  //
  //     ee.on(`onUpdate-${input.lobbyId}`, onUpdate);
  //     return () => {
  //       ee.off(`onUpdate-${input.lobbyId}`, onUpdate);
  //     };
  //   });
  // }),
  onMessage: authedProcedure.subscription(({ ctx }) => {
    const { user } = ctx;

    return observable<Message>((emit) => {
      const onMessage = (incomingMessage: Message) => {
        emit.next(incomingMessage);
      };

      ee.on(`onMessage-${user.serverHash}`, onMessage);
      return () => {
        ee.off(`onMessage-${user.serverHash}`, onMessage);
      };
    });
  }),
});

export type RoomRouter = typeof roomRouter;
