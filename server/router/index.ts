import { commonRouter } from "./common";
import { roomRouter } from "./room";
import { userRouter } from "./user";
import { t } from "../trpc";

export const appRouter = t.mergeRouters(
  t.router({ user: userRouter }),
  t.router({ room: roomRouter }),
  t.router({ common: commonRouter })
);

export type AppRouter = typeof appRouter;
