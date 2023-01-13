import { CircularLoadingSpinner, SearchIcon } from "components/common/icon";
import { Component, createSignal, For, Show } from "solid-js";
import { Accessor, Setter } from "solid-js";
import { Source } from "../../../../../server/router/room/types";
import trackClickOutside from "utils/trackClickOutside";
import { useI18n } from "@solid-primitives/i18n";

type Props = {
  text: Accessor<string>;
  sources: Source[];
  selectedSource: Accessor<Source | undefined>;
  onSourceChange: (newSource: Source) => void;
  onTextChange: Setter<string>;
  onFocus: (event: FocusEvent) => void;
  onSearch: (text: string, source: Source | undefined) => void;
  loading: Accessor<boolean>;
};

const Search: Component<Props> = (props) => {
  const [t] = useI18n();

  const [sourceOpen, setSourceOpen] = createSignal(false);

  const getSourcePlaceHolder = (source: Source | undefined) => {
    return t(`search.${source?.value}.placeholder`) || t("search.placeholder");
  };

  return (
    <form
      class="item-center flex"
      onSubmit={(e) => {
        e.preventDefault();
        props.onSearch(props.text(), props.selectedSource());
      }}
    >
      <div class="relative flex w-full flex-row">
        <div>
          <Show when={sourceOpen()}>
            <div
              id="dropdown"
              class="absolute z-10 w-28 translate-y-12 divide-y divide-gray-100 rounded bg-white shadow dark:bg-neutral-700"
              ref={(ref) => {
                trackClickOutside(ref, (open) => {
                  setSourceOpen(open);
                });
              }}
            >
              <ul
                class="py-1 text-sm text-neutral-700 dark:text-gray-200"
                aria-labelledby="dropdown-button"
              >
                <For each={props.sources}>
                  {(source) => (
                    <Show when={source.id !== props.selectedSource()?.id}>
                      <li>
                        <button
                          type="button"
                          class="inline-flex h-full w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-600 dark:hover:text-white"
                          onClick={() => {
                            setSourceOpen(false);
                            props.onSourceChange(source);
                          }}
                        >
                          {t(`search.${source.value}.name`)}
                        </button>
                      </li>
                    </Show>
                  )}
                </For>
              </ul>
            </div>
          </Show>
          <button
            class="z-10 inline-flex h-full w-28 flex-shrink-0 items-center justify-between rounded-l-lg border border-neutral-300 bg-neutral-100 py-2.5 px-4 text-center text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSourceOpen((open) => !open);
            }}
          >
            <Show
              when={props.selectedSource()?.value}
              fallback={
                <div class="flex w-full justify-center">
                  <div class="h-5 w-5">
                    <CircularLoadingSpinner />
                  </div>
                </div>
              }
            >
              {t(`search.${props.selectedSource()?.value}.name`)}
            </Show>
            <svg
              aria-hidden="true"
              class="ml-1 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div class="relative flex-1">
          <div class="pointer-events-none inset-y-0 left-0 flex items-center">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span class="h-5 w-5 text-neutral-500 dark:text-neutral-400">
                <SearchIcon />
              </span>
            </div>
          </div>
          <input
            type="text"
            class="input rounded-l-none border-l-0 p-2.5 pl-10"
            placeholder={getSourcePlaceHolder(props.selectedSource()) ?? ""}
            required
            onChange={(e) => props.onTextChange(e.currentTarget.value)}
            onFocus={(e) => props.onFocus(e)}
            value={props.text()}
            disabled={props.loading()}
          />
        </div>
      </div>
      <button
        type="submit"
        class="ml-2 rounded-lg border border-custom-primary-700 bg-custom-primary-900 p-2.5 text-sm font-medium text-white hover:bg-custom-primary-800 focus:outline-none dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800"
        onClick={() => props.onSearch(props.text(), props.selectedSource())}
        disabled={props.loading()}
      >
        <div class="h-5 w-5">
          <SearchIcon />
        </div>
        <span class="sr-only">Hae kappaletta</span>
      </button>
    </form>
  );
};

export default Search;
