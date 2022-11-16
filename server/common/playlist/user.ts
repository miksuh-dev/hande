import { MumbleUser } from "types/auth";
import ee from "../../eventEmitter";
import prisma from "../../prisma";
import { sendMessage } from "../../router/room/message";
import {
  getCurrentSong,
  getNextSong,
  playSong,
  stopCurrentSong,
} from "./internal";

export const addSong = async (
  song: {
    videoId: string;
    title: string;
    thumbnail: string;
  },
  requester: MumbleUser
) => {
  const addedSong = await prisma.song.create({
    data: {
      videoId: song.videoId,
      title: song.title,
      thumbnail: song.thumbnail,
      requester: requester.name,
    },
  });

  sendMessage(`${requester.name} lisäsi kappaleen "${song.title}" jonoon`);

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

    sendMessage(`${user.name} aloitti kappaleen ${nextSong.title}`);

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

  if (!getCurrentSong()) {
    const nextSong = await getNextSong();
    if (nextSong) {
      await playSong(nextSong);
    }
  }

  if (song.id === getCurrentSong()?.id) {
    sendMessage(`${user.name} ohitti kappaleen "${song.title}"`);

    stopCurrentSong();

    const nextSong = await getNextSong();
    if (nextSong) {
      await playSong(nextSong);
    }

    return song;
  }

  ee.emit(`onUpdate`, { song: { remove: song.id } });

  sendMessage(`${user.name} poisti "${song.title}" kappaleen jonosta`);

  return song;
};
