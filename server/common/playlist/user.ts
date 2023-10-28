import { TRPCError } from "@trpc/server";
import { OnlineUser } from "types/auth";
import { Song } from "types/prisma";
import {
  addSongToQueue,
  getCurrentSong,
  getNextSong,
  getSongRating,
  removeSongFromQueue,
  setVolume,
  stopCurrentSong,
  addRandomSong as addRandomSongInternal,
  handleAutoPlay,
} from "./internal";
import * as room from "../../common/room";
import ee from "../../eventEmitter";
import prisma from "../../prisma";
import { sendMessage } from "../../router/room/message";
import { MessageType } from "../../router/room/types";
import { VoteType } from "../../types/app";

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
  const addedSongs = (await prisma.$transaction(
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
  )) as Song[];

  const firstSong = addedSongs[0];

  if (!firstSong) {
    throw new Error("No songs added");
  }

  ee.emit(`onUpdate`, { song: { add: addedSongs } });

  if (addedSongs.length > 1) {
    sendMessage(`event.source.${firstSong.type}.addedMany`, {
      user: requester,
      type: MessageType.ACTION,
      item: addedSongs,
    });
  } else {
    sendMessage(`event.source.${firstSong.type}.added`, {
      user: requester,
      type: MessageType.ACTION,
      item: [firstSong],
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
  const song = (await prisma.song
    .update({
      where: {
        id,
        skipped: false,
        ended: false,
      },
      data: {
        skipped: true,
      },
    })
    .catch(() => {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error.songNotFound",
      });
    })) as Song;

  const currentSong = await removeSongFromQueue(song);
  if (currentSong) {
    sendMessage(`event.source.${song.type}.skipped`, {
      user,
      type: MessageType.ACTION,
      item: [song],
    });
    await stopCurrentSong(song);

    if (!getCurrentSong()) {
      const nextSong = await getNextSong();
      if (nextSong) {
        await addSongToQueue(nextSong);
      }
    }
  } else {
    sendMessage(`event.source.${song.type}.skippedQueue`, {
      user,
      type: MessageType.ACTION,
      item: [song],
    });
  }

  ee.emit(`onUpdate`, { song: { remove: [song.id] } });

  return song;
};

const getVoteValue = (vote: VoteType) => {
  switch (vote) {
    case VoteType.UP:
      return 1;
    case VoteType.DOWN:
      return -1;
    default:
      return 0;
  }
};

export const voteSong = async (
  songId: number,
  contentId: string,
  vote: VoteType,
  user: OnlineUser
) => {
  const voteValue = getVoteValue(vote);

  const data = {
    contentId,
    songId,
    voter: user.name,
    vote: voteValue,
  };

  const addedVote = await prisma.songRating.upsert({
    where: {
      voter_unique: {
        songId,
        contentId,
        voter: user.name,
      },
    },
    update: data,
    create: data,
  });

  const currentSong = getCurrentSong();
  if (currentSong && currentSong.contentId === contentId) {
    const rating = await getSongRating(contentId);

    const updatedSong = {
      ...currentSong,
      rating,
    };

    ee.emit(`onUpdate`, { song: { setPlaying: updatedSong } });
  }

  return addedVote;
};

export const volumeChange = async (
  contentId: string,
  volume: number,
  user: OnlineUser
) => {
  const settings = await prisma.songSettings.upsert({
    create: {
      contentId,
      volume,
    },
    update: {
      volume,
    },
    where: {
      contentId,
    },
  });

  const song = (await prisma.song.findFirstOrThrow({
    where: { contentId },
    orderBy: {
      createdAt: "asc",
    },
  })) as Song;

  const currentSong = getCurrentSong();
  if (currentSong && currentSong.contentId === contentId) {
    const updatedSong = {
      ...currentSong,
      volume: settings.volume,
    };

    ee.emit(`onUpdate`, { song: { setPlaying: updatedSong } });

    setVolume(settings.volume);
  }

  sendMessage(`event.common.changedVolume`, {
    user,
    type: MessageType.ACTION,
    item: [song],
  });

  return settings;
};

export const clearPlaylist = async (requester: OnlineUser) => {
  const ignoreCurrent = {
    id: {
      not: getCurrentSong()?.id,
    },
  };

  const songs = await prisma.song.findMany({
    where: {
      ended: false,
      skipped: false,
      ...ignoreCurrent,
    },
  });

  await prisma.song.updateMany({
    where: {
      ended: false,
      skipped: false,
      ...ignoreCurrent,
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

  await handleAutoPlay();

  return songs;
};

export const addRandomSong = async (requester: OnlineUser) => {
  const song = await addRandomSongInternal(requester, "user");

  if (!getCurrentSong()) {
    const nextSong = await getNextSong();
    if (nextSong) {
      await addSongToQueue(nextSong);
    }
  }

  return song;
};

export const toggleAutoplay = async (requester: OnlineUser) => {
  const newState = !room.get().autoplay
    ? room.createAutoPlay(requester)
    : undefined;

  room.setOption("autoplay", newState);

  sendMessage(
    newState ? `event.common.autoplayOn` : `event.common.autoplayOff`,
    {
      user: requester,
      type: MessageType.ACTION,
    }
  );

  if (newState) {
    await handleAutoPlay();

    if (!getCurrentSong()) {
      const nextSong = await getNextSong();
      if (nextSong) {
        await addSongToQueue(nextSong);
      }
    }
  }

  ee.emit(`onUpdate`, { room: { autoplay: newState } });

  return !!newState;
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

export const playNext = async (id: number, requester: OnlineUser) => {
  const nextSong = await getNextSong();

  const position = (nextSong?.position ?? 0) - 1;

  const song = (await prisma.song.update({
    where: {
      id: id,
    },
    data: {
      position,
    },
  })) as Song;

  sendMessage(`event.source.${song.type}.setAsNext`, {
    user: requester,
    type: MessageType.ACTION,
    item: [song],
  });

  ee.emit(`onUpdate`, { song: { update: [song] } });

  return song;
};

export const movePosition = async (
  id: number,
  position: number,
  requester: OnlineUser
) => {
  const songs = (await prisma.song.findMany({
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
  })) as Song[];

  const selectedSong = songs.find((s) => s.id === id);
  if (!selectedSong) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "error.songNotFound",
    });
  }

  const fromIndex = songs.findIndex((s) => s.id === id);
  const toIndex = fromIndex + position;

  const updatedPositions = [...songs];

  updatedPositions.splice(fromIndex, 1);
  updatedPositions.splice(toIndex, 0, selectedSong);

  const updatedSongs = (await prisma.$transaction(
    updatedPositions.map((song, index) => {
      return prisma.song.update({
        where: {
          id: song.id,
        },
        data: {
          position: index,
        },
      });
    })
  )) as Song[];

  sendMessage(`event.common.movedSong`, {
    user: requester,
    type: MessageType.ACTION,
    item: [selectedSong],
  });

  const changedSongs = updatedSongs.filter((newSong, index) => {
    const oldSong = songs[index];
    if (!oldSong) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error.songNotFound",
      });
    }

    if (newSong.id !== oldSong.id) {
      return true;
    }

    if (newSong.position !== oldSong.position) {
      return true;
    }
  });

  ee.emit(`onUpdate`, { song: { update: changedSongs } }); //   // ee.emit(`onUpdate`, { song: { update: updatedSongs } });

  return changedSongs;
};
