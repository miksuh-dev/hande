import {
  Accessor,
  Component,
  createContext,
  createEffect,
  createResource,
  createSignal,
  JSX,
  on,
} from "solid-js";
import {
  I18nContext,
  createI18nContext,
  useI18n,
} from "@solid-primitives/i18n";
import trpcClient from "trpc";
import { Language } from "trpc/types";

type LanguageContext = {
  current: Accessor<Language["current"] | undefined>;
  available: Accessor<string[]>;
  change: (language: string) => Promise<void>;
};

// TODO: Set initial data
export const I18nSetterContext = createContext<LanguageContext>();

export const I18nSetterProvider: Component<{ children: JSX.Element }> = (
  props,
) => {
  const [, { add, locale, dict }] = useI18n();
  const [currentLanguage, setCurrentLanguage] =
    createSignal<Language["current"]>();

  const [available, setAvailable] = createSignal<string[]>([]);

  const [language] = createResource<Language>(() =>
    trpcClient.common.language.query({
      language: localStorage.getItem("language") ?? undefined,
    }),
  );

  createEffect(
    on(language, (selectedLanguage) => {
      if (selectedLanguage?.current) {
        const { name, data } = selectedLanguage.current;
        add(name, data);

        locale(name);
        setCurrentLanguage(selectedLanguage.current);
      }

      if (selectedLanguage?.available) {
        setAvailable(selectedLanguage.available);
      }
    }),
  );

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
    <I18nSetterContext.Provider
      value={{
        current: currentLanguage,
        available: available,
        change: handleLanguageChange,
      }}
    >
      {props.children}
    </I18nSetterContext.Provider>
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
