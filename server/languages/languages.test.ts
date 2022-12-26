import * as languages from "./language";

const flatten = (
  obj: Record<string, unknown>,
  parent: string | undefined,
  res: Record<string, unknown>
): Record<string, unknown> => {
  for (const key in obj) {
    const propName = parent ? `${parent}.${key}` : key;
    if (typeof obj[key] == "object") {
      flatten(obj[key] as Record<string, unknown>, propName, res);
    } else {
      res[propName] = obj[key];
    }
  }

  return res;
};

describe("Test languages are defined correctly", () => {
  test("no missing server translations exist", () => {
    const allTranslations = new Map<string, string[]>();

    Object.entries(languages).forEach(([name, language]) => {
      const keys = Object.keys(flatten(language.server, undefined, {}));

      keys.forEach((key) => {
        const existing = allTranslations.get(key) ?? [];

        allTranslations.set(key, [...existing, name]);
      });
    });

    const languagesTotal = Object.keys(languages).length;
    const translationsArray = [...allTranslations.entries()];

    const completeKeys = translationsArray.find(
      ([, l]) => l.length === languagesTotal
    )?.[1];

    if (!completeKeys) {
      throw new Error("No complete translation row found");
    }

    translationsArray.forEach((translation) => {
      const [name] = translation;

      expect(translation).toEqual([name, completeKeys]);
    });
  });

  test("no missing client translations exist", () => {
    const allTranslations = new Map<string, string[]>();

    Object.entries(languages).forEach(([name, language]) => {
      const keys = Object.keys(flatten(language.client, undefined, {}));

      keys.forEach((key) => {
        const existing = allTranslations.get(key) ?? [];

        allTranslations.set(key, [...existing, name]);
      });
    });

    const languagesTotal = Object.keys(languages).length;
    const translationsArray = [...allTranslations.entries()];

    const completeKeys = translationsArray.find(
      ([, l]) => l.length === languagesTotal
    )?.[1];

    if (!completeKeys) {
      throw new Error("No complete translation row found");
    }

    translationsArray.forEach((translation) => {
      const [name] = translation;

      expect(translation).toEqual([name, completeKeys]);
    });
  });
});
