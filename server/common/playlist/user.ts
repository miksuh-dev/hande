import ee from "eventEmitter";
import { MumbleUser } from "types/auth";
import prisma from "../../prisma";
import { getCurrentSong } from "./internal";

const sendLogMessage = (content: string) => {
  const message = {
    id: Date.now().toString(),
    username: "Hande",
    content,
    timestamp: Date.now(),
  };

  ee.emit("onUpdate", { message: { add: message } });
};

export const addSong = async (
  song: {
    id: string;
    title: string;
    thumbnail: string;
  },
  serverHash: string,
  requester: MumbleUser
) => {
  const addedSong = await prisma.song.create({
    data: {
      videoId: song.id,
      title: song.title,
      thumbnail: song.thumbnail,
      serverHash: serverHash,
      requester: requester.name,
    },
  });

  sendLogMessage(`${requester.name} lisäsi kappaleen ${song.title} jonoon`);

  return addedSong;
};

export const removeSong = async (
  id: number,
  serverHash: string,
  user: MumbleUser
) => {
  const song = await prisma.song.findFirst({
    where: {
      id: id,
      serverHash: serverHash,
    },
  });

  if (!song) {
    throw new Error("Song not found");
  }

  const isCurrentSong = song.id === getCurrentSong()?.id;

  if (isCurrentSong) {
    sendLogMessage(`${user.name} ohitti kapaleen ${song.title}`);
  } else {
    sendLogMessage(`${user.name} poisti ${song.title} kappaleen jonosta`);
  }

  await prisma.song.update({
    where: {
      id: song.id,
    },
    data: {
      skipped: true,
    },
  });

  return song;
};
