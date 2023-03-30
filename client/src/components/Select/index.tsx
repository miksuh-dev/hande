import { CircularLoadingSpinner } from "components/common/icon";
import { Component, createSignal, For, Show } from "solid-js";
import trackClickOutside from "utils/trackClickOutside";

export type Option = {
  name: string;
  value: string;
};

type Props = {
  options: Option[];
  selectedSource?: Option;
  onSelect: (option: Option) => void;
};

const SelectComponent: Component<Props> = (props) => {
  const [selectOpen, setSelectOpen] = createSignal(false);

  return (
    <form
      class="item-center flex flex-1"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div class="relative flex w-full flex-row">
        <div class="relative flex w-full flex-row">
          <Show when={selectOpen()}>
            <div
              id="dropdown"
              class="absolute z-10 w-full translate-y-12 divide-y divide-gray-100 rounded bg-white shadow dark:bg-neutral-700"
              ref={(ref) => {
                trackClickOutside(ref, (open) => {
                  setSelectOpen(open);
                });
              }}
            >
              <ul
                class="py-1 text-sm text-neutral-700 dark:text-gray-200"
                aria-labelledby="dropdown-button"
              >
                <For each={props.options}>
                  {(option) => (
                    <Show when={option.value !== props.selectedSource?.value}>
                      <li>
                        <button
                          type="button"
                          class="inline-flex h-full w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-600 dark:hover:text-white"
                          onClick={() => {
                            setSelectOpen(false);
                            props.onSelect(option);
                          }}
                        >
                          {option.name}
                        </button>
                      </li>
                    </Show>
                  )}
                </For>
              </ul>
            </div>
          </Show>
          <button
            class="z-10 inline-flex h-full w-full flex-shrink-0 items-center justify-between rounded-lg border border-neutral-300 bg-neutral-100 py-2.5 px-4 text-center text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectOpen((open) => !open);
            }}
          >
            <Show
              when={props.selectedSource}
              fallback={
                <div class="flex w-full justify-center">
                  <div class="h-5 w-5">
                    <CircularLoadingSpinner />
                  </div>
                </div>
              }
            >
              {props.selectedSource?.name}
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
      </div>
    </form>
  );
};

export default SelectComponent;
