import { useI18n } from "@solid-primitives/i18n";
import { CircularLoadingSpinner } from "components/common/icon";
import { DateTime } from "luxon";
import { Accessor, Component, For, Show } from "solid-js";
import { Song } from "trpc/types";
import { htmlDecode } from "utils/parse";

type Props = {
  history: Song[];
  songs: Song[];
  playing: Song | undefined;
  selected: Accessor<Song[]>;
  onSongSelect: (song: Song) => void;
  isInQueue: (song: Song) => boolean;
  loading: Accessor<boolean>;
};

const HistoryComponent: Component<Props> = (props) => {
  const [t] = useI18n();

  const isSelected = (song: Song) => {
    return props.selected().some((s) => s.contentId === song.contentId);
  };

  return (
    <div class="space-y h-full max-h-full space-y-2 overflow-y-auto pr-4">
      <Show
        when={!props.loading()}
        fallback={
          <div class="flex h-full items-center justify-center">
            <span class="h-16 w-16">
              <CircularLoadingSpinner />
            </span>
          </div>
        }
      >
        <For each={props.history}>
          {(song) => (
            <button
              class="card flex w-full cursor-pointer items-center justify-between border p-2 px-4"
              disabled={props.isInQueue(song)}
              onClick={() => props.onSongSelect(song)}
            >
              <div class="flex items-center space-x-4">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-neutral-300 bg-neutral-100 text-custom-primary-600 dark:border-neutral-600 dark:bg-neutral-700"
                  checked={isSelected(song)}
                  disabled={props.isInQueue(song)}
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onSongSelect(song);
                  }}
                />
                <Show when={song.thumbnail}>
                  {(thumbnail: string) => (
                    <img
                      class="border-1 h-10 w-10 rounded-full"
                      src={thumbnail}
                      alt="thumbnail"
                    />
                  )}
                </Show>
                <div class="flex flex-col text-neutral-900 dark:text-neutral-200">
                  <h3 class="text-md text-left font-medium">
                    {htmlDecode(song.title)}
                  </h3>
                  <div class="space-x-4 self-start text-sm font-medium">
                    <span>
                      {t("common.requestedAt")}: {song.requester}{" "}
                      {htmlDecode(
                        DateTime.fromJSDate(song.createdAt, { zone: "utc" })
                          .setZone("local")
                          .toFormat("dd.MM.yyyy HH:mm")
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          )}
        </For>
      </Show>
    </div>
  );
};

export default HistoryComponent;
