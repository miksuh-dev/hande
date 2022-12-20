import {
  Component,
  createContext,
  createEffect,
  createResource,
  JSX,
  Show,
} from "solid-js";
import {
  I18nContext,
  createI18nContext,
  useI18n,
} from "@solid-primitives/i18n";
import { Language } from "trpc/types";
import trpcClient from "trpc";

interface I18nSetterContextProps {
  current: Language["current"] | undefined;
  available: string[];
  change: (language: string) => void;
}

const INITIAL_STATE: I18nSetterContextProps = {
  current: undefined,
  available: [],
  change: (_: string) => {},
};

export const I18nSetterContext =
  createContext<I18nSetterContextProps>(INITIAL_STATE);

const I18nSetterProvider: Component<{ children: JSX.Element }> = (props) => {
  const [, { add, locale, dict }] = useI18n();

  const [language] = createResource<Language>(() =>
    trpcClient.common.language.query({
      language: localStorage.getItem("language") ?? undefined,
    })
  );

  createEffect(() => {
    const selectedLanguage = language();

    if (selectedLanguage?.current) {
      const { name, data } = selectedLanguage.current;
      add(name, data);
      locale(name);
    }
  });

  const handleLanguageChange = async (language: string) => {
    if (!dict(language)) {
      const newLanguage = await trpcClient.common.language.query({
        language,
      });

      if (newLanguage) {
        const { name, data } = newLanguage.current;
        add(name, data);
      }
    }

    locale(language);
    localStorage.setItem("language", language);
  };

  return (
    <Show when={language.state === "ready"}>
      <I18nSetterContext.Provider
        value={{
          current: language()?.current,
          available: language()?.available ?? [],
          change: handleLanguageChange,
        }}
      >
        {props.children}
      </I18nSetterContext.Provider>
    </Show>
  );
};

export const I18nProvider: Component<{ children: JSX.Element }> = (props) => {
  const value = createI18nContext();

  return (
    <I18nContext.Provider value={value}>
      <I18nSetterProvider>{props.children}</I18nSetterProvider>
    </I18nContext.Provider>
  );
};
