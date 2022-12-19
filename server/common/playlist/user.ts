import { MumbleUser } from "types/auth";
import ee from "../../eventEmitter";
import prisma from "../../prisma";
import { sendMessage } from "../../router/room/message";
import { MessageType } from "../../router/room/types";
import {
  getCurrentSong,
  getNextSong,
  playSong,
  stopCurrentSong,
} from "./internal";

export const addSong = async (
  song: {
    url: string;
    contentId: string;
    title: string;
    thumbnail: string | null;
    type: string;
  },
  requester: MumbleUser
) => {
  const addedSong = await prisma.song.create({
    data: {
      url: song.url,
      contentId: song.contentId,
      title: song.title,
      thumbnail: song.thumbnail,
      requester: requester.name,
      type: song.type,
    },
  });

  sendMessage(`lisäsi kappaleen "${song.title}" jonoon.`, {
    user: requester,
    type: MessageType.ACTION,
  });

  ee.emit(`onUpdate`, { song: { add: addedSong } });

  if (!getCurrentSong()) {
    const nextSong = await getNextSong();
    if (nextSong) {
      await playSong(nextSong);
    }
  }

  return addedSong;
};

export const startPlay = async (user: MumbleUser) => {
  const currentSong = getCurrentSong();

  if (currentSong) {
    throw new Error("Kappale on jo soimassa");
  }

  const nextSong = await getNextSong();
  if (nextSong) {
    await playSong(nextSong);

    sendMessage(`aloitti kappaleen "${nextSong.title}".`, {
      user,
      type: MessageType.ACTION,
    });

    return nextSong;
  }

  throw new Error("Ei kappaleita jonossa");
};

export const removeSong = async (id: number, user: MumbleUser) => {
  const song = await prisma.song.update({
    where: {
      id,
    },
    data: {
      skipped: true,
    },
  });

  if (song.id === getCurrentSong()?.id) {
    sendMessage(`ohitti kappaleen "${song.title}".`, {
      user,
      type: MessageType.ACTION,
    });
    stopCurrentSong();
  } else {
    sendMessage(`poisti "${song.title}" kappaleen jonosta.`, {
      user,
      type: MessageType.ACTION,
    });
    ee.emit(`onUpdate`, { song: { remove: song.id } });
  }

  if (!getCurrentSong()) {
    const nextSong = await getNextSong();
    if (nextSong) {
      await playSong(nextSong);
    }
  }

  return song;
};

export const playNext = async (id: number, user: MumbleUser) => {
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

  sendMessage(`siirsi kappaleen "${song.title}" jonon kärkeen.`, {
    user,
    type: MessageType.ACTION,
  });

  ee.emit(`onUpdate`, { song: { update: song } });

  return song;
};
