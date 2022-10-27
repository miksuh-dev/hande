import type { inferProcedureInput, inferProcedureOutput } from "@trpc/server";
import { inferObservableValue } from "@trpc/server/observable";
import type { AppRouter } from "../../../server/router";

export type Room = inferProcedureOutput<AppRouter["room"]["get"]>;

export type Song = inferProcedureOutput<
  AppRouter["room"]["get"]
>["songs"][number];

export type User = Room["users"][number];
export type IncomingMessage = Room["messages"][number];

export type UserLoginInput = inferProcedureInput<AppRouter["user"]["login"]>;

export type YoutubeSearchResult = inferProcedureOutput<
  AppRouter["youtube"]["search"]
>[number];

export type RoomUpdateEvent = inferObservableValue<
  inferProcedureOutput<AppRouter["room"]["onUpdate"]>
>;
