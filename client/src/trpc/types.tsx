import type { inferProcedureInput, inferProcedureOutput } from "@trpc/server";
import { inferObservableValue } from "@trpc/server/observable";
import type { AppRouter } from "../../../server/router";

export type Room = inferProcedureOutput<AppRouter["room"]["get"]>;

export type IncomingMessage = inferObservableValue<
  inferProcedureOutput<AppRouter["room"]["onMessage"]>
>;

export type UserLoginInput = inferProcedureInput<AppRouter["user"]["login"]>;

export type User = inferProcedureOutput<AppRouter["user"]["me"]>;
