import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { DateTime } from "luxon";
import { z } from "zod";
import { OnlineUser } from "types/auth";
import { messages, sendMessage } from "./message";
import { searchFromPlaylist, searchFromSource } from "./sources";
import { MessageType, UpdateEvent } from "./types";
import { getCurrentSong } from "../../common/playlist/internal";
import {
  addRandomSong,
  addSongs,
  clearPlaylist,
  movePosition,
  playNext,
  removeSong,
  shufflePlaylist,
  toggleAutoplay,
  volumeChange,
  voteSong,
} from "../../common/playlist/user";
import * as room from "../../common/room";
import { PAGE_SIZE } from "../../constants";
import ee from "../../eventEmitter";
import { t } from "../../trpc";
import { VoteType } from "../../types/app";
import { Song, SongTypeSong } from "../../types/prisma";
import { SOURCES, SourceType } from "../../types/source";
import { getSessionVersion } from "../../utils/auth";
import {
  enrichUpdateMessageWithUserVote,
  enrichWithUserVote,
  playingToClient,
} from "../../utils/middleware";
import { schemaForType } from "../../utils/trpc";
import * as userState from "../user/state";
import { authedProcedure, onlineUserProcedure } from "../utils";

export const roomRouter = t.router({
  get: authedProcedure.query(async ({ ctx }) => {
    const { prisma, user } = ctx;

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
      playing: playingToClient(
        await enrichWithUserVote(getCurrentSong(), user)
      ),
      room: room.get(),
      songs: playlist as Song[],
      messages,
      users: [...userState.users.values()].map((u) => u.user),
      sources: SOURCES,
      version: getSessionVersion().version,
    };
  }),
  addSong: onlineUserProcedure
    .input(
      z.array(
        z.object({
          url: z.string().min(1),
          contentId: z.string().min(1),
          title: z.string().min(1),
          thumbnail: z.string().nullable(),
          type: z.enum([SourceType.SONG, SourceType.RADIO]),
        })
      )
    )
    .mutation(async ({ input, ctx }) => {
      const { onlineUser } = ctx;

      return addSongs(input, onlineUser);
    }),
  addRandomSong: onlineUserProcedure.mutation(async ({ ctx }) => {
    const { onlineUser } = ctx;

    await addRandomSong(onlineUser);

    return true;
  }),
  removeSong: onlineUserProcedure
    .input(
      z.object({
        id: z.number().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { onlineUser } = ctx;
      try {
        const song = await removeSong(input.id, onlineUser);

        return song;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "error.songNotFound",
        });
      }
    }),
  playNext: onlineUserProcedure
    .input(
      z.object({
        id: z.number().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { onlineUser } = ctx;

      const song = await playNext(input.id, onlineUser);

      return { song };
    }),
  movePosition: onlineUserProcedure
    .input(
      z.object({
        id: z.number().min(1),
        position: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { onlineUser } = ctx;

      await movePosition(input.id, input.position, onlineUser);

      return true;
    }),
  skipCurrent: onlineUserProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { onlineUser } = ctx;

      return removeSong(input.id, onlineUser);
    }),
  voteSong: onlineUserProcedure
    .input(
      z.object({
        songId: z.number().min(1),
        contentId: z.string().min(1),
        vote: z.enum([VoteType.UP, VoteType.DOWN, VoteType.NONE]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { onlineUser } = ctx;
      const { songId, contentId, vote } = input;

      await voteSong(songId, contentId, vote, onlineUser);

      return true;
    }),
  changeVolume: onlineUserProcedure
    .input(
      z.object({
        contentId: z.string().min(1),
        volume: z.number().min(0).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { onlineUser } = ctx;
      const { contentId, volume } = input;

      await volumeChange(contentId, volume, onlineUser);

      return true;
    }),
  clearPlaylist: onlineUserProcedure.mutation(async ({ ctx }) => {
    const { onlineUser } = ctx;

    await clearPlaylist(onlineUser);

    return true;
  }),
  shufflePlaylist: onlineUserProcedure.mutation(async ({ ctx }) => {
    const { onlineUser } = ctx;

    await shufflePlaylist(onlineUser);

    return true;
  }),
  autoplay: onlineUserProcedure.mutation(async ({ ctx }) => {
    const { onlineUser } = ctx;

    return await toggleAutoplay(onlineUser);
  }),
  search: authedProcedure
    .input(
      z.object({
        text: z.string().min(1),
        source: z.enum([
          SourceType.SONG,
          SourceType.PLAYLIST,
          SourceType.RADIO,
        ]),
      })
    )
    .query(async ({ input }) => {
      const { text, source } = input;

      return await searchFromSource(text, source);
    }),
  listPlaylist: authedProcedure
    .input(
      z.object({
        playlistId: z.string().min(1),
      })
    )
    .query(({ input }) => {
      const { playlistId } = input;

      return searchFromPlaylist(playlistId);
    }),
  listHistory: authedProcedure
    .input(
      z.object({
        text: z.string(),
        user: z.string(),
        page: z.number().min(1),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const where = {
        ended: true,

        requester: {
          contains: input.user,
        },
        title: {
          contains: input.text,
        },
        type: {
          not: "radio",
        },
      };

      const result = await prisma.$transaction([
        prisma.song.count({ where }),
        prisma.song.findMany({
          where,
          take: PAGE_SIZE,
          skip: PAGE_SIZE * (input.page - 1),
          orderBy: [
            {
              createdAt: "desc",
            },
          ],
        }),
      ]);

      return {
        total: result[0],
        pageSize: PAGE_SIZE,
        list: result[1] as SongTypeSong[],
      };
    }),
  getStatistics: authedProcedure
    .input(
      z.object({
        after: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const after = DateTime.fromISO(input.after, { zone: "utc" });
      if (!after.isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid date",
        });
      }

      const top = await prisma.song.groupBy({
        by: ["contentId"],
        where: {
          createdAt: {
            gte: after.toISO(),
          },
        },
        take: 100,
        orderBy: {
          _count: {
            contentId: "desc",
          },
        },
        _count: {
          contentId: true,
        },
      });

      const songs = (await prisma.song.findMany({
        where: {
          contentId: {
            in: top.map((r) => r.contentId),
          },
        },
      })) as Song[];

      return top.map((r) => {
        const song = songs.find((s) => s.contentId === r.contentId);

        if (!song) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "error.songNotFound",
          });
        }

        return {
          ...song,
          type: song.type,
          count: r._count.contentId,
        };
      });
    }),
  ping: authedProcedure.input(z.string().min(10)).mutation(({ input }) => {
    const pingTarget = input;

    ee.emit(`onPing-${pingTarget}`, "pong");

    return "pong";
  }),
  message: onlineUserProcedure
    .input(
      z.object({
        content: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      const { onlineUser } = ctx;

      const message = sendMessage(input.content, {
        user: onlineUser,
        type: MessageType.MESSAGE,
      });

      return message;
    }),
  onUpdate: authedProcedure
    .input(
      z.object({
        clientId: z.string().min(1),
        state: schemaForType<OnlineUser["state"]>()(
          z.object({
            isVideoOn: z.boolean().optional(),
            theme: z.string().optional(),
          })
        ),
      })
    )
    .subscription(({ ctx, input }) => {
      const { user } = ctx;
      const { clientId, state } = input;

      return observable<Partial<UpdateEvent>>((emit) => {
        const onUpdate = (updatedLobby: Partial<UpdateEvent>) => {
          void (async () => {
            emit.next(
              await enrichUpdateMessageWithUserVote(updatedLobby, user)
            );
          })();
        };

        ee.on(`onUpdate`, onUpdate);

        const userWithState = { ...user, state };
        userState.join(userWithState, clientId);

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
