import fs from "fs";
import path from "path";
import { getMarkdownIt } from "../../utils/markdown";
import { z } from "zod";
import {
  getClientLanguage,
  availableLanguages as available,
} from "@server/languages";
import { userProcedure } from "@server/router/utils";
import { t } from "@server/trpc";

const markdownIt = getMarkdownIt();

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
  changelog: userProcedure.query(() => {
    const content = markdownIt
      .parse(
        fs.readFileSync(path.join(process.cwd(), "CHANGELOG.md")).toString(),
        {}
      )
      .filter((_, index) => index > 5); // Ignore description in the beginning

    return markdownIt.renderer.render(content, {}, {});
  }),
});

export type CommonRouter = typeof commonRouter;
