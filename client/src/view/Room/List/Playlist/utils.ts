import { DateTime } from "luxon";

export type TimeLeft = {
  hours: number;
  minutes: number;
};

export const getTimeLeft = (dateTimeIso: string): TimeLeft => {
  const { hours, minutes } = DateTime.fromISO(dateTimeIso, {
    zone: "utc",
  }).diff(DateTime.utc(), ["hours", "minutes"]);

  return {
    hours,
    minutes,
  };
};

export const formatTimeLeft = (timeleft: TimeLeft) => {
  const { hours } = timeleft;
  const minutes = Math.round(timeleft.minutes);

  if (minutes === 60) {
    return `${hours + 1} h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes} min`;
  }

  return `${minutes} min`;
};
