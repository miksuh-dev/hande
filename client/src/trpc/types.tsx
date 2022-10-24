import type { inferProcedureInput, inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "../../../server/router";

export type Room = inferProcedureOutput<AppRouter["room"]["get"]>;

export type User = Room["users"][number];
export type IncomingMessage = Room["messages"][number];

export type UserLoginInput = inferProcedureInput<AppRouter["user"]["login"]>;
