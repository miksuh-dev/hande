import { z } from "zod";
import {
  getClientLanguage,
  availableLanguages as available,
} from "../../languages";
import { t } from "../../trpc";

export const commonRouter = t.router({
  language: t.procedure
    .input(
      z.object({
        language: z.string().optional(),
      })
    )
    .query(({ input }) => {
      const defaultLanguage = process.env.SERVER_LANGUAGE;

      if (!defaultLanguage) {
        throw new Error("SERVER_LANGUAGE environment variable is not set");
      }

      const current = getClientLanguage(input.language ?? defaultLanguage);

      return {
        current,
        available,
      };
    }),
});

export type CommonRouter = typeof commonRouter;
