import { DateTime } from "luxon";

export const getTimeLeft = (dateTimeIso: string) => {
  const timeleft = DateTime.fromISO(dateTimeIso, { zone: "utc" }).diff(
    DateTime.utc(),
    "minutes",
  ).minutes;

  return timeleft >= 0 ? timeleft : 0;
};
