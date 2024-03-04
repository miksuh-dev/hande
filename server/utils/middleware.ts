import { Message, UpdateEvent } from "@server/router/room/types";
import { Client, PlayingSong, Server, VoteType } from "@server/types/app";
import { MumbleUser } from "@server/types/auth";
import { Song } from "@server/types/prisma";
import prisma from "../prisma";

const voteValueToVoteType = (vote: number | undefined) => {
  if (vote === 1) return VoteType.UP;
  if (vote === -1) return VoteType.DOWN;
  return VoteType.NONE;
};

export const playingToClient = async (
  song: PlayingSong<Server> | undefined,
  user: MumbleUser
): Promise<PlayingSong<Client> | undefined> => {
  if (!song) return undefined;

  const enrichedSong = await enrichWithUserVote(song, user);

  return {
    ...enrichedSong,
    createdAt: song.createdAt.toISOString(),
  };
};

export const messageToClient = (message: Message<Server>): Message<Client> => {
  const { item, ...rest } = message;

  return {
    ...rest,
    ...(item && { item: item.map(songToClient) }),
  };
};

export const songToClient = (song: Song<Server>): Song<Client> => {
  return {
    ...song,
    createdAt: song.createdAt.toISOString(),
  };
};

export const enrichWithUserVote = async (
  song: PlayingSong<Server>,
  user: MumbleUser
) => {
  const rating = await prisma.songRating.findFirst({
    where: {
      songId: song.id,
      contentId: song.contentId,
      voter: user.name,
    },
  });

  return {
    ...song,
    vote: voteValueToVoteType(rating?.vote),
  };
};

const processSongEvent = async (
  event: UpdateEvent<Server>["song"],
  user: MumbleUser
): Promise<UpdateEvent<Client>["song"]> => {
  if (!event) return undefined;

  const { add, remove, setPlaying, update, skip } = event;

  return {
    ...(add && {
      add: add.map((song) => songToClient(song)),
    }),
    ...(remove && {
      remove,
    }),
    ...(setPlaying && {
      setPlaying: await playingToClient(setPlaying, user),
    }),
    ...(update && {
      update: update.map((song) => songToClient(song)),
    }),
    ...(skip && {
      skip,
    }),
  };
};

export const processMessageEvent = (
  event: UpdateEvent<Server>["message"]
): UpdateEvent<Client>["message"] => {
  if (!event) return undefined;

  const { add } = event;

  return {
    ...(add && {
      add: messageToClient(add),
    }),
  };
};

export const enrichUpdateMessage = async (
  updatedLobby: UpdateEvent<Server>,
  user: MumbleUser
): Promise<Partial<UpdateEvent<"client">>> => {
  const songEvent = await processSongEvent(updatedLobby.song, user);
  const messageEvent = processMessageEvent(updatedLobby.message);
  const userEvent = updatedLobby.user;
  const roomEvent = updatedLobby.room;

  return {
    ...(songEvent && { song: songEvent }),
    ...(messageEvent && { message: messageEvent }),
    ...(userEvent && { user: userEvent }),
    ...(roomEvent && { room: roomEvent }),
  };
};
