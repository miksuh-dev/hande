import type { inferProcedureInput, inferProcedureOutput } from "@trpc/server";
import { inferObservableValue } from "@trpc/server/observable";
import type { AppRouter } from "@server/router";
import { SongType, SourceType } from "@server/types/source";
import { VoteType, PlayState, PlayingSong, Client } from "@server/types/app";
import { Song } from "@server/types/prisma";

export type Room = inferProcedureOutput<AppRouter["room"]["get"]>;

export type Source = Room["sources"][number];

export type SongClient<T extends SongType = SongType> = Song<Client, T>;

export type PlayingSongClient<T extends SongType = SongType> = PlayingSong<
  Client,
  T
>;

export type User = Room["users"][number];
export type IncomingMessage = Room["messages"][number];

export type UserLoginInput = inferProcedureInput<AppRouter["user"]["login"]>;
export type UserRegisterInput = inferProcedureInput<
  AppRouter["user"]["register"]
>;

export type SearchResult = inferProcedureOutput<
  AppRouter["room"]["search"]
>[number];

export type SearchResultSong = SearchResult & { type: SourceType.SONG };
export type SearchResultPlaylist = SearchResult & { type: SourceType.PLAYLIST };
export type SearchResultRadio = SearchResult & { type: SourceType.RADIO };

export type AddSongInput = inferProcedureInput<AppRouter["room"]["addSong"]>;

export type RoomUpdateEvent = inferObservableValue<
  inferProcedureOutput<AppRouter["room"]["onUpdate"]>
>;

export type Language = inferProcedureOutput<AppRouter["common"]["language"]>;

export type LyricsItem = inferProcedureOutput<
  AppRouter["room"]["getCurrentLyrics"]
>;

export type ListHistory = inferProcedureOutput<
  AppRouter["room"]["listHistory"]
>;

export type HistoryItem = ListHistory["list"][number];

export type StatisticItem = inferProcedureOutput<
  AppRouter["room"]["getStatistics"]
>[number];

export type StatisticsInput = inferProcedureInput<
  AppRouter["room"]["getStatistics"]
>;

export { SourceType, VoteType, PlayState, SongType };
