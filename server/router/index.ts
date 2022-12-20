import { t } from "../trpc";
import { commonRouter } from "./common";
import { roomRouter } from "./room";
import { userRouter } from "./user";

export const appRouter = t.mergeRouters(
  t.router({ user: userRouter }),
  t.router({ room: roomRouter }),
  t.router({ common: commonRouter })
);

export type AppRouter = typeof appRouter;
