import { Song } from "@prisma/client";
import { MumbleUser } from "types/auth";
import prisma from "../../prisma";

const playing = new Map<string, Song>();

export const addSong = async (
  song: {
    id: string;
    title: string;
    thumbnail: string;
  },
  serverHash: string,
  requester: MumbleUser
) => {
  return await prisma.song.create({
    data: {
      videoId: song.id,
      title: song.title,
      thumbnail: song.thumbnail,
      serverHash: serverHash,
      requester: requester.name,
    },
  });
};

export const getCurrentSong = (serverHash: string): Song | undefined => {
  return playing.get(serverHash);
};

export const skipCurrentSong = async (id: number, serverHash: string) => {
  const currentSong = playing.get(serverHash);

  if (!currentSong) {
    throw new Error("No song is playing");
  }

  if (currentSong.id !== id) throw new Error("Song is not playing");

  await prisma.song.update({
    where: {
      id: currentSong.id,
    },
    data: {
      endedAt: new Date(),
    },
  });

  // Next song
  return await prisma.song.findFirst({
    where: {
      serverHash: serverHash,
      endedAt: null,
    },
  });
};

export const removeSong = async (id: number, serverHash: string) => {
  const currentSong = playing.get(serverHash);
  if (currentSong?.id === id) {
    throw new Error("Cannot remove playing song");
  }

  const song = await prisma.song.findFirst({
    where: {
      id: id,
      serverHash: serverHash,
    },
  });

  if (!song) {
    throw new Error("Song not found");
  }

  await prisma.song.delete({
    where: {
      id: song.id,
    },
  });

  return song;
};
