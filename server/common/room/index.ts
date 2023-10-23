import { DateTime } from "luxon";
import { OnlineUser } from "types/auth";
import { AUTOPLAY_DURATION } from "../../constants";

export interface Autoplay {
  requester: OnlineUser;
  time: DateTime;
}

export interface Room {
  autoplay: Autoplay | undefined;
}

export const room: Room = {
  autoplay: undefined,
};

export const get = () => {
  return room;
};

export const setOption = <T extends keyof Room>(option: T, value: Room[T]) => {
  room[option] = value;
};

export const createAutoPlay = (
  requester: OnlineUser
): NonNullable<Room["autoplay"]> => {
  return {
    time: DateTime.utc().plus({ seconds: AUTOPLAY_DURATION }),
    requester,
  };
};

export const hasAutoplayExpired = () => {
  if (!room.autoplay) return false;

  const expired =
    DateTime.utc() > room.autoplay.time.plus({ seconds: AUTOPLAY_DURATION });
  if (expired) {
    setOption("autoplay", undefined);
  }

  return expired;
};