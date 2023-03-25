import { OnlineUser } from "types/auth";
import ee from "../../eventEmitter";
import prisma from "../../prisma";
import { sendMessage } from "../../router/room/message";
import { MessageType } from "../../router/room/types";
import {
  addSongToQueue,
  getCurrentSong,
  getNextSong,
  removeSongFromQueue,
  stopCurrentSong,
} from "./internal";

export const addSongs = async (
  songs: {
    url: string;
    contentId: string;
    title: string;
    thumbnail: string | null;
    type: string;
  }[],
  requester: OnlineUser
) => {
  const lastSong = await prisma.song.findFirst({
    where: {
      ended: false,
      skipped: false,
    },
    orderBy: [
      {
        position: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const position = lastSong ? lastSong.position + 1 : 0;

  const contentIds = songs.map((o) => o.contentId);
  const addedSongs = await prisma.$transaction(
    songs
      .filter(
        ({ contentId }, index) => !contentIds.includes(contentId, index + 1)
      )
      .map((song, index) => {
        return prisma.song.create({
          data: {
            url: song.url,
            contentId: song.contentId,
            title: song.title,
            thumbnail: song.thumbnail,
            requester: requester.name,
            type: song.type,
            position: position + index,
          },
        });
      })
  );

  const firstSong = addedSongs[0];

  if (!firstSong) {
    throw new Error("No songs added");
  }

  ee.emit(`onUpdate`, { song: { add: addedSongs } });

  if (addedSongs.length > 1) {
    sendMessage(`event.source.${firstSong.type}.addedMany`, {
      user: requester,
      type: MessageType.ACTION,
      count: addedSongs.length,
    });
  } else {
    sendMessage(`event.source.${firstSong.type}.added`, {
      user: requester,
      type: MessageType.ACTION,
      item: firstSong.title,
    });
  }

  if (!getCurrentSong()) {
    const nextSong = await getNextSong();
    if (nextSong) {
      await addSongToQueue(nextSong);
    }
  }

  return addedSongs;
};

export const removeSong = async (id: number, user: OnlineUser) => {
  const song = await prisma.song.update({
    where: {
      id,
    },
    data: {
      skipped: true,
    },
  });

  if (song.id === getCurrentSong()?.id) {
    sendMessage(`event.source.${song.type}.skipped`, {
      user,
      type: MessageType.ACTION,
      item: song.title,
    });
    stopCurrentSong();
  } else {
    sendMessage(`event.source.${song.type}.skippedQueue`, {
      user,
      type: MessageType.ACTION,
      item: song.title,
    });
    ee.emit(`onUpdate`, { song: { remove: [song.id] } });
  }

  removeSongFromQueue(song);

  if (!getCurrentSong()) {
    const nextSong = await getNextSong();
    if (nextSong) {
      await addSongToQueue(nextSong);
    }
  }

  return song;
};

export const clearPlaylist = async (requester: OnlineUser) => {
  const songs = await prisma.song.findMany({
    where: {
      ended: false,
      skipped: false,
    },
  });

  await prisma.song.updateMany({
    where: {
      ended: false,
      skipped: false,
    },
    data: {
      skipped: true,
    },
  });

  sendMessage(`event.common.clearedPlaylist`, {
    user: requester,
    type: MessageType.ACTION,
  });

  ee.emit(`onUpdate`, { song: { remove: songs.map((s) => s.id) } });

  return songs;
};

export const shufflePlaylist = async (requester: OnlineUser) => {
  const songs = await prisma.song.findMany({
    where: {
      ended: false,
      skipped: false,
      id: { not: getCurrentSong()?.id },
    },
  });

  const positions = songs
    .map((_, index) => index)
    .sort(() => Math.random() - 0.5);

  const updatedSongs = await prisma.$transaction(
    songs.map((song, index) => {
      return prisma.song.update({
        where: {
          id: song.id,
        },
        data: {
          position: positions[index],
        },
      });
    })
  );

  sendMessage(`event.common.shuffledPlaylist`, {
    user: requester,
    type: MessageType.ACTION,
  });

  ee.emit(`onUpdate`, { song: { update: updatedSongs } });

  return updatedSongs;
};

export const playNext = async (id: number, user: OnlineUser) => {
  const nextSong = await getNextSong();

  const position = (nextSong?.position ?? 0) - 1;

  const song = await prisma.song.update({
    where: {
      id: id,
    },
    data: {
      position,
    },
  });

  sendMessage(`event.source.${song.type}.setAsNext`, {
    user,
    type: MessageType.ACTION,
    item: song.title,
  });

  ee.emit(`onUpdate`, { song: { update: [song] } });

  return song;
};
