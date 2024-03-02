import { UpdateEvent } from "@server/router/room/types";
import { PlayingSong, Server, VoteType } from "@server/types/app";
import { MumbleUser } from "@server/types/auth";
import prisma from "../prisma";

const voteValueToVoteType = (vote: number | undefined) => {
  if (vote === 1) return VoteType.UP;
  if (vote === -1) return VoteType.DOWN;
  return undefined;
};

export const playingToClient = async (
  song: PlayingSong<Server> | undefined,
  user: MumbleUser
): Promise<PlayingSong<"client"> | undefined> => {
  if (!song) return undefined;

  const enrichedSong = await enrichWithUserVote(song, user);

  return {
    ...enrichedSong,
    endedAt: song.endedAt?.toISO(),
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

export const enrichUpdateMessage = async (
  updatedLobby: Partial<UpdateEvent<Server>>,
  user: MumbleUser
): Promise<Partial<UpdateEvent<"client">>> => {
  const songEvent = updatedLobby.song;

  if (songEvent && "setPlaying" in songEvent) {
    return {
      ...updatedLobby,
      song: {
        ...updatedLobby.song,
        setPlaying: await playingToClient(songEvent.setPlaying, user),
      },
    };
  }

  return updatedLobby as Partial<UpdateEvent<"client">>;
};
