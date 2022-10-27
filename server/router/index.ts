import { t } from "../trpc";
import { roomRouter } from "./room";
import { userRouter } from "./user";
import { youtubeRouter } from "./youtube";

export const appRouter = t.mergeRouters(
  t.router({ user: userRouter }),
  t.router({ room: roomRouter }),
  t.router({ youtube: youtubeRouter })
);

export type AppRouter = typeof appRouter;
