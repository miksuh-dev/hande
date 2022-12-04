import { Component, For, Show } from "solid-js";
import { Song, YoutubeSearchResult } from "trpc/types";
import { Accessor } from "solid-js";
import { htmlDecode } from "utils/parse";
import { CircularLoadingSpinner } from "components/common/icon";

type Props = {
  results: Accessor<YoutubeSearchResult[]>;
  songs: Song[];
  onAdd: (data: YoutubeSearchResult) => void;
  loading: Accessor<boolean>;
  onClose: () => void;
};

const Result: Component<Props> = (props) => {
  return (
    <div class="absolute top-full left-0 right-0 max-h-[500px]  space-y-2 overflow-auto rounded-sm rounded-t-none bg-neutral-400 p-2 dark:bg-neutral-900">
      <Show
        when={!props.loading()}
        fallback={
          <div class="flex  justify-center py-2 ">
            <span class="h-10 w-10">
              <CircularLoadingSpinner />
            </span>
          </div>
        }
      >
        <For each={props.results()}>
          {(result) => {
            return (
              <div class="w-full bg-white p-3 dark:bg-neutral-800 ">
                <div class="flex items-center space-x-2">
                  <img
                    class="h-10 w-10 rounded-full"
                    src={result.thumbnail.url}
                    alt=""
                  />
                  <div class="ml-2 w-full">
                    <h5 class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {htmlDecode(result.title)}
                    </h5>
                  </div>
                  <Show
                    when={
                      !props.songs.some((s) => s.videoId === result.videoId)
                    }
                    fallback={
                      <button
                        type="button"
                        class="ml-auto inline-flex shrink-0 items-center rounded border border-transparent bg-custom-primary-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-custom-primary-800 focus:outline-none focus:ring-2 focus:ring-custom-primary-500 focus:ring-offset-2 dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800 dark:focus:ring-custom-primary-500"
                        disabled
                      >
                        Jonossa
                      </button>
                    }
                  >
                    <button
                      type="button"
                      class="ml-auto inline-flex shrink-0 items-center rounded border border-transparent bg-custom-primary-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-custom-primary-800 focus:outline-none focus:ring-2 focus:ring-custom-primary-500 focus:ring-offset-2 dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800 dark:focus:ring-custom-primary-500"
                      onClick={() => props.onAdd(result)}
                    >
                      Lisää jonoon
                    </button>
                  </Show>
                </div>
              </div>
            );
          }}
        </For>
      </Show>
    </div>
  );
};

export default Result;
