import { ThemeName } from "context/theme/themes";
import useSnackbar from "hooks/useSnackbar";
import useTheme from "hooks/useTheme";
import { createEffect, createSignal, For, Show } from "solid-js";
import trackClickOutside from "utils/trackClickOutside";
import trpcClient from "trpc";
import Tooltip from "components/Tooltip";
import { CheckMarkIcon, ColorPickerIcon } from "../common/icon";
import { useI18n } from "@solid-primitives/i18n";

const getInitialBrightnessValue = () => {
  const theme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (theme) {
    return theme;
  }

  if (prefersDark) {
    return "dark";
  }

  return "light";
};

const ThemeSelect = () => {
  const [t] = useI18n();
  const [open, setOpen] = createSignal(false);

  const theme = useTheme();
  const [brightness, setBrightness] = createSignal(getInitialBrightnessValue());
  const snackbar = useSnackbar();

  createEffect(() => {
    if (brightness() === "dark") {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });

  const handleColorThemeChange = async (themeName: ThemeName) => {
    try {
      await trpcClient.user.updateState.mutate({ theme: themeName });
    } catch (e) {
      if (e instanceof Error) {
        snackbar.error(t("error.common", { error: e.message }));
        console.log("e", e);
      }
    } finally {
      theme.action.setCurrent(themeName);
    }
  };

  return (
    <div
      class="relative"
      ref={(ref) => {
        trackClickOutside(ref, (open) => {
          setOpen(open);
        });
      }}
    >
      <Tooltip text={t("navigation.theme.tooltip")} visible={!open()}>
        <button
          type="button"
          class="flex w-9 rounded-full text-sm text-custom-primary-700"
          onClick={() => setOpen((open) => !open)}
        >
          <ColorPickerIcon />
        </button>
      </Tooltip>
      <Show when={open()}>
        <div class="relative">
          <div class="absolute right-0 top-0 z-50 my-4 list-none divide-y divide-neutral-200 rounded border-2 border-neutral-500 bg-white text-base shadow dark:divide-neutral-600 dark:bg-neutral-800">
            <div class="py-3 px-3 text-neutral-900 dark:text-neutral-100">
              <div>
                <p class="p-1">{t("navigation.theme.brightness")}:</p>
                <div class="grid w-max grid-cols-2">
                  <button class="m-2 flex flex-col justify-self-center">
                    <div
                      class="flex h-10 w-10 items-center justify-center border-4 border-neutral-700 bg-white hover:bg-neutral-300 dark:border-neutral-400 dark:bg-white dark:hover:bg-neutral-200"
                      onClick={() => setBrightness("light")}
                    >
                      <Show when={brightness() === "light"}>
                        <CheckMarkIcon />
                      </Show>
                    </div>
                  </button>
                  <button class="m-2 flex flex-col justify-self-center">
                    <div
                      class="flex h-10 w-10 items-center justify-center border-4 border-neutral-500 bg-neutral-800 hover:bg-neutral-900 dark:border-white dark:bg-neutral-900 dark:hover:bg-black"
                      onClick={() => setBrightness("dark")}
                    >
                      <Show when={brightness() === "dark"}>
                        <CheckMarkIcon />
                      </Show>
                    </div>
                  </button>
                </div>
              </div>
              <div>
                <p class="p-1">{t("navigation.theme.color")}:</p>
                <div class="grid w-max grid-cols-3">
                  <For each={theme.list}>
                    {({ name, value }) => (
                      <button class="m-2 flex flex-col justify-self-center">
                        <div
                          class="flex h-10 w-10 items-center justify-center border-4 dark:text-neutral-800"
                          style={{
                            ["background-color"]: value["400"],
                            ["border-color"]: value["600"],
                          }}
                          onMouseOver={(event) => {
                            event.currentTarget.style.backgroundColor =
                              value["900"];
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.backgroundColor =
                              value["400"];
                          }}
                          onClick={() => handleColorThemeChange(name)}
                        >
                          <Show when={name === theme.current()}>
                            <CheckMarkIcon />
                          </Show>
                        </div>
                      </button>
                    )}
                  </For>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default ThemeSelect;
