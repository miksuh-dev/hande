import {
  Component,
  createContext,
  createEffect,
  createResource,
  JSX,
  Resource,
  Signal,
} from "solid-js";
import {
  I18nContext,
  createI18nContext,
  useI18n,
} from "@solid-primitives/i18n";
import trpcClient from "trpc";
import { createStore, reconcile, unwrap } from "solid-js/store";
import { Language } from "trpc/types";

function createDeepSignal<T>(value: T): Signal<T> {
  const [store, setStore] = createStore({
    value,
  });

  return [
    // eslint-disable-next-line solid/reactivity
    () => store.value,
    // eslint-disable-next-line solid/reactivity
    (v: T) => {
      const unwrapped = unwrap(store.value);
      typeof v === "function" && (v = v(unwrapped));
      setStore("value", reconcile(v));
      return store.value;
    },
  ] as Signal<T>;
}

type LanguageContext = {
  change: (language: string) => Promise<void>;
  data: Resource<Language>;
};

// TODO: Set initial data
export const I18nSetterContext = createContext<LanguageContext>();

const I18nSetterProvider: Component<{ children: JSX.Element }> = (props) => {
  const [, { add, locale, dict }] = useI18n();

  const [language] = createResource<Language>(
    () =>
      trpcClient.common.language.query({
        language: localStorage.getItem("language") ?? undefined,
      }),
    {
      storage: createDeepSignal,
    }
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
    <I18nSetterContext.Provider
      value={{
        data: language,
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
