import { t } from "../trpc";
import { roomRouter } from "./room";
import { userRouter } from "./user";

export const appRouter = t.mergeRouters(
  t.router({ user: userRouter }),
  t.router({ room: roomRouter })
);

export type AppRouter = typeof appRouter;
