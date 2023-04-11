import { Component, For, Match, Show, Switch } from "solid-js";
import {
  AddSongInput,
  PlayingSong,
  SearchResult,
  SearchResultPlaylist,
  Song,
  SourceType,
} from "trpc/types";
import { Accessor } from "solid-js";
import { htmlDecode } from "utils/parse";
import { CircularLoadingSpinner } from "components/common/icon";
import { useI18n } from "@solid-primitives/i18n";
import SongThumbnail from "../common/SongThumbnail";

type Props = {
  results: Accessor<SearchResult[]>;
  songs: Song[];
  playing: PlayingSong;
  onAdd: (data: AddSongInput) => void;
  onPlaylistView: (data: SearchResultPlaylist) => void;
  loading: Accessor<boolean>;
  onClose: () => void;
};

const Result: Component<Props> = (props) => {
  const [t] = useI18n();

  return (
    <div class="absolute top-full left-0 right-0 rounded-sm bg-neutral-400 p-2 dark:bg-neutral-900">
      <div class="space-y-2 overflow-auto">
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
          <Show
            when={props.results().length}
            fallback={
              <div class="flex flex-col justify-center text-center">
                <h5 class="text-xl">Ei hakutuloksia</h5>
              </div>
            }
          >
            <For each={props.results()}>
              {(result) => {
                return (
                  <div class="card w-full p-2">
                    <div class="flex items-center space-x-2">
                      <SongThumbnail song={result} />
                      <div class="ml-2 flex w-full flex-col space-y-2">
                        <h5 class="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {htmlDecode(result.title)}
                        </h5>
                      </div>
                      <Switch>
                        <Match
                          when={
                            props.songs.some(
                              (s) => s.contentId === result.contentId
                            ) || props.playing?.contentId === result.contentId
                          }
                        >
                          <button
                            type="button"
                            class="ml-auto inline-flex shrink-0 items-center rounded border border-transparent bg-custom-primary-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-custom-primary-800 focus:outline-none focus:ring-2 focus:ring-custom-primary-500 focus:ring-offset-2 dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800 dark:focus:ring-custom-primary-500"
                            disabled
                          >
                            {t("common.inQueue")}
                          </button>
                        </Match>
                        <Match
                          when={
                            result.type === SourceType.SONG ||
                            result.type === SourceType.RADIO
                          }
                        >
                          <button
                            type="button"
                            class="ml-auto inline-flex shrink-0 items-center rounded border border-transparent bg-custom-primary-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-custom-primary-800 focus:outline-none focus:ring-2 focus:ring-custom-primary-500 focus:ring-offset-2 dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800 dark:focus:ring-custom-primary-500"
                            onClick={() => props.onAdd([result])}
                          >
                            {t("actions.addToQueue")}
                          </button>
                        </Match>
                        <Match when={result.type === SourceType.PLAYLIST}>
                          <button
                            type="button"
                            class="ml-auto inline-flex shrink-0 items-center rounded border border-transparent bg-custom-primary-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-custom-primary-800 focus:outline-none focus:ring-2 focus:ring-custom-primary-500 focus:ring-offset-2 dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800 dark:focus:ring-custom-primary-500"
                            onClick={(event) => {
                              event.stopPropagation();
                              props.onPlaylistView(result);
                              props.onClose();
                            }}
                          >
                            {t("actions.viewPlaylist")}
                          </button>
                        </Match>
                      </Switch>
                    </div>
                  </div>
                );
              }}
            </For>
          </Show>
        </Show>
      </div>
    </div>
  );
};

export default Result;
