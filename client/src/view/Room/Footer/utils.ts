import { PlayingSongClient, SongType } from "trpc/types";

export const secondsToTime = (seconds: number): string => {
  const date = new Date(0);
  date.setSeconds(seconds);

  const timeString = date.toISOString().substring(11, 19);

  if (timeString.startsWith("00:")) {
    return timeString.substring(3);
  }

  return timeString;
};

export const hasSongDetails = (
  song: PlayingSongClient<SongType.SONG>,
): boolean => {
  return song.artist !== null && song.track !== null;
};
