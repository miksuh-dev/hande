import { JSX, createContext, createSignal, onMount, Accessor } from "solid-js";
import type { Component } from "solid-js";
import themes, { ThemeName, Theme } from "./themes";

type ThemeStoreProps = {
  current: Accessor<ThemeName>;
  list: ReturnType<typeof getListOfThemes>;
  action: {
    setCurrent: (themeName: ThemeName) => void;
  };
};

const getCurrentTheme = (): ThemeName => {
  const storageTheme: ThemeName = localStorage.getItem(
    "colorTheme"
  ) as ThemeName;

  if (storageTheme) {
    const selected = Object.keys(themes).some((theme) => {
      return theme === storageTheme;
    });

    if (selected) {
      return storageTheme;
    }
  }

  // Default theme is first
  const selected = (Object.keys(themes) as ThemeName[])[0];

  if (!selected) {
    throw new Error(`Theme ${selected} not found`);
  }

  return selected;
};

const getListOfThemes = () => {
  return Object.entries(themes).map(
    ([key, value]) =>
      ({ name: key, value } as { name: ThemeName; value: Theme })
  );
};

const getThemeFromId = (name: ThemeName) => {
  return Object.entries(themes).find(([key]) => key === name)?.[1];
};

const applyTheme = (theme: Theme) => {
  if (!theme) {
    return;
  }

  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--primary-color-${key}`, value);
  });
};

const setCurrentTheme = (name: ThemeName) => {
  const newTheme = getThemeFromId(name);

  if (newTheme) {
    applyTheme(newTheme);
    localStorage.setItem("colorTheme", name);
  }
};

const INITIAL_VALUE = {
  current: () => getCurrentTheme(),
  list: getListOfThemes(),
  action: {
    setCurrent: (themeName: ThemeName) => {
      setCurrentTheme(themeName);
    },
  },
};

export const ThemeContext = createContext<ThemeStoreProps>(INITIAL_VALUE);

export const ThemeProvider: Component<{
  children: JSX.Element;
}> = (props) => {
  const [current, setCurrent] = createSignal<ThemeName>(getCurrentTheme());

  onMount(() => {
    const currentTheme = current();
    if (currentTheme) {
      setCurrentTheme(currentTheme);
    }
  });

  const value = {
    current,
    list: getListOfThemes(),
    action: {
      setCurrent: (themeName: ThemeName) => {
        setCurrentTheme(themeName);
        setCurrent(themeName);
      },
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  );
};
