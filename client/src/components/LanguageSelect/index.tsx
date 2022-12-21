import { Component, createSignal, For, Show } from "solid-js";
import trackClickOutside from "utils/trackClickOutside";
import Tooltip from "components/Tooltip";
import { CircularLoadingSpinner, LanguageIcon } from "../common/icon";
import { useI18n } from "@solid-primitives/i18n";
import useLanguage from "hooks/useLanguage";

const LanguageSelect: Component = () => {
  const [t] = useI18n();
  const [open, setOpen] = createSignal(false);
  const language = useLanguage();

  return (
    <div
      class="relative"
      ref={(ref) => {
        trackClickOutside(ref, (open) => {
          setOpen(open);
        });
      }}
    >
      <Tooltip text={t("navigation.language.tooltip")} visible={!open()}>
        <button
          type="button"
          class="flex w-9 rounded-full text-sm text-custom-primary-700"
          onClick={() => setOpen((open) => !open)}
        >
          <LanguageIcon />
        </button>
      </Tooltip>
      <Show when={open()}>
        <div class="relative">
          <div class="tooltip absolute right-0 top-0 z-50 my-4 w-[150px] list-none divide-y divide-neutral-200 text-base">
            <Show
              when={language?.available()}
              fallback={<CircularLoadingSpinner />}
            >
              <For each={[...(language?.available() ?? [])].sort()}>
                {(lng: string) => (
                  <ul class="py-1">
                    <li>
                      <button
                        onClick={() => {
                          language?.change(lng);
                          setOpen(false);
                        }}
                        class="block w-full py-2 px-4 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-custom-primary-700"
                      >
                        {t(`language.${lng}`)}
                      </button>
                    </li>
                  </ul>
                )}
              </For>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default LanguageSelect;
