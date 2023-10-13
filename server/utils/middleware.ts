import { UpdateEvent } from "router/room/types";
import prisma from "../prisma";
import { PlayingSong, VoteType } from "../types/app";
import { MumbleUser } from "../types/auth";

const voteValueToVoteType = (vote: number) => {
  if (vote === 1) return VoteType.UP;
  if (vote === -1) return VoteType.DOWN;
  return undefined;
};

export const playingToClient = (song: PlayingSong | undefined) => {
  if (!song) return song;

  return {
    ...song,
    startedAt: song.startedAt.toISO(),
  };
};

export const enrichWithUserVote = async (
  song: PlayingSong | undefined,
  user: MumbleUser
) => {
  if (!song) return undefined;

  const rating = await prisma.songRating.findFirst({
    where: {
      songId: song.id,
      contentId: song.contentId,
      voter: user.name,
    },
  });
  if (!rating) return song;

  return {
    ...song,
    vote: voteValueToVoteType(rating.vote),
  };
};

export const enrichUpdateMessageWithUserVote = async (
  updatedLobby: Partial<UpdateEvent>,
  user: MumbleUser
) => {
  const setPlaying = updatedLobby.song?.setPlaying;

  if (setPlaying) {
    return {
      ...updatedLobby,
      song: {
        ...updatedLobby.song,
        setPlaying: await enrichWithUserVote(setPlaying, user),
      },
    };
  }

  return updatedLobby;
};
