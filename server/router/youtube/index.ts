import { z } from "zod";
import { t } from "../../trpc";
import { authedProcedure } from "../utils";
import { searchList } from "./query";
import { parseSearchListItem } from "./utils";

export const youtubeRouter = t.router({
  search: authedProcedure
    .input(
      z.object({
        text: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const result = await searchList(input.text);

      return result.map(parseSearchListItem);
    }),
});

export type YoutubeRouter = typeof youtubeRouter;
