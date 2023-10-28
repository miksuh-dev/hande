import { DateTime } from "luxon";
import ee from "eventEmitter";
import { sendMessage } from "router/room/message";
import { OnlineUser } from "types/auth";
import { AUTOPLAY_DURATION_HOURS } from "../../constants";

export interface Autoplay {
  requester: OnlineUser;
  time: DateTime;
}

export interface Room {
  autoplay: Autoplay | undefined;
}

export type RoomClient = typeof getClient;

export const room: Room = {
  autoplay: undefined,
};

type AutoplayExpireReason = "emptyRoom" | "timeout";

export const get = () => {
  return room;
};

export const getClient = () => {
  const autoplay = room.autoplay
    ? {
        ...room.autoplay,
        time: room.autoplay.time.toISO(),
      }
    : undefined;

  return { ...room, autoplay };
};

export const setOption = <T extends keyof Room>(option: T, value: Room[T]) => {
  room[option] = value;
};

export const createAutoPlay = (
  requester: OnlineUser
): NonNullable<Room["autoplay"]> => {
  return {
    time: DateTime.utc().plus({ hours: AUTOPLAY_DURATION_HOURS }),
    requester,
  };
};

export const hasAutoplayExpired = () => {
  if (!room.autoplay) return false;

  const expired = DateTime.utc() > room.autoplay.time;

  return expired;
};

export const onAutoplayExpire = (reason: AutoplayExpireReason = "timeout") => {
  setOption("autoplay", undefined);

  sendMessage(`event.common.autoplayExpired.${reason}`);
  ee.emit(`onUpdate`, { room: { autoplay: undefined } });
};
