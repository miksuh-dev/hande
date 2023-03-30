import type { inferProcedureInput, inferProcedureOutput } from "@trpc/server";
import { inferObservableValue } from "@trpc/server/observable";
import type { AppRouter } from "../../../server/router";

export type Room = inferProcedureOutput<AppRouter["room"]["get"]>;

export type Song = Room["songs"][number];
export type PlayingSong = Song & { startedAt: string; duration: number };
export type Source = Room["sources"][number];

export type User = Room["users"][number];
export type IncomingMessage = Room["messages"][number];

export type UserLoginInput = inferProcedureInput<AppRouter["user"]["login"]>;
export type UserRegisterInput = inferProcedureInput<
  AppRouter["user"]["register"]
>;

export type SearchResult = inferProcedureOutput<
  AppRouter["room"]["search"]
>[number];

export type SearchResultSong = SearchResult & { type: "song" };
export type SearchResultPlaylist = SearchResult & { type: "playlist" };
export type SearchResultRadio = SearchResult & { type: "radio" };

export type RoomUpdateEvent = inferObservableValue<
  inferProcedureOutput<AppRouter["room"]["onUpdate"]>
>;

export type Language = inferProcedureOutput<AppRouter["common"]["language"]>;

export type ListHistory = inferProcedureOutput<
  AppRouter["room"]["listHistory"]
>;

export type Statistic = inferProcedureOutput<
  AppRouter["room"]["getStatistics"]
>[number];
export type StatisticsInput = inferProcedureInput<
  AppRouter["room"]["getStatistics"]
>;
