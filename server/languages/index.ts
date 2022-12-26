import { english, finnish } from "./language";
import { ClientLanguage, ServerLanguage } from "./types";

export const serverLanguage = ((): ServerLanguage => {
  const language = process.env.SERVER_LANGUAGE;

  if (!language) {
    throw new Error("SERVER_LANGUAGE environment variable is not set");
  }
  switch (language) {
    case "fi":
      return finnish.server;
    case "en":
      return english.server;
    default:
      throw new Error("Language not supported");
  }
})();

export const getClientLanguage = (
  language: string
): { name: string; data: ClientLanguage } => {
  switch (language) {
    case "fi":
      return { name: "fi", data: finnish.client };
    case "en":
      return { name: "en", data: english.client };
    default:
      throw new Error(`Language ${language} not found`);
  }
};

export const availableLanguages = ["fi", "en"];
