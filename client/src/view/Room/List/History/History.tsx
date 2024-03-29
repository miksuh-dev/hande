import { useI18n } from "@solid-primitives/i18n";
import { CircularLoadingSpinner } from "components/common/icon";
import { DateTime } from "luxon";
import { Accessor, Component, For, Show } from "solid-js";
import { HistoryItem, SongClient } from "trpc/types";
import { htmlDecode } from "utils/parse";
import SongThumbnail from "view/Room/common/SongThumbnail";

type Props = {
  history: HistoryItem[];
  songs: SongClient[];
  playing: SongClient | undefined;
  selected: Accessor<SongClient[]>;
  onSongSelect: (song: HistoryItem) => void;
  isInQueue: (song: HistoryItem) => boolean;
  loading: Accessor<boolean>;
};

const HistoryComponent: Component<Props> = (props) => {
  const [t] = useI18n();

  const isSelected = (song: SongClient) => {
    return props.selected().some((s) => s.contentId === song.contentId);
  };

  return (
    <div class="space-y h-full max-h-full space-y-2 overflow-y-auto pr-4 scrollbar">
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

                <SongThumbnail song={song} />
                <div class="flex flex-col text-neutral-900 dark:text-neutral-200">
                  <h3 class="text-md text-left font-medium">
                    {htmlDecode(song.title)}
                  </h3>
                  <div class="space-x-4 self-start text-sm font-medium">
                    <span>
                      {t("common.requestedAt")}: {song.requester}
                      {", "}
                      {htmlDecode(
                        DateTime.fromISO(song.createdAt, { zone: "utc" })
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
