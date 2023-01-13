import { useI18n } from "@solid-primitives/i18n";
import { CircularLoadingSpinner, CrossIcon } from "components/common/icon";
import {
  Component,
  createResource,
  createSignal,
  For,
  Show,
  Suspense,
} from "solid-js";
import { Portal } from "solid-js/web";
import trpcClient from "trpc";
import { SearchResultPlaylist, SearchResultSong, Song } from "trpc/types";

type Props = {
  playlist: SearchResultPlaylist;
  playing: Song;
  songs: Song[];
  onSongAdd: (songs: SearchResultSong[]) => Promise<void>;
  onClose: () => void;
};

const PlaylistView: Component<Props> = (props) => {
  const [t] = useI18n();

  const [selected, setSelected] = createSignal<SearchResultSong[]>([]);

  const [songs] = createResource<SearchResultSong[]>(() =>
    trpcClient.room.listPlaylist.query({
      playlistId: props.playlist.contentId,
    })
  );

  const isInQueue = (song: SearchResultSong) => {
    return (
      props.songs.some((s) => s.contentId === song.contentId) ||
      (props.playing && props.playing.contentId === song.contentId)
    );
  };

  const onSongSelect = (song: SearchResultSong) => {
    const isSelected = selected().some((s) => s.contentId === song.contentId);

    if (isSelected) {
      setSelected(selected().filter((s) => s.contentId !== song.contentId));
    } else if (!isInQueue(song)) {
      setSelected([...selected(), song]);
    }
  };

  const onSelectAll = () => {
    const allSelected = (songs() ?? []).filter(
      (s) =>
        !props.songs.some((ps) => s.contentId === ps.contentId) &&
        (!props.playing || props.playing.contentId !== s.contentId)
    );

    setSelected(allSelected);
  };

  return (
    <Portal>
      <div
        class="tooltip fixed top-1/2 left-1/2 z-50 h-full w-full -translate-y-1/2 -translate-x-1/2 overflow-hidden outline-none md:h-3/4 md:w-3/4 2xl:w-1/2"
        tabindex="-1"
        role="dialog"
      >
        <div class="oveflow-y-hidden pointer-events-none relative h-full w-auto">
          <div class="pointer-events-auto relative flex h-full w-full flex-col rounded-md border-none bg-neutral-50 bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-800">
            <div class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b border-neutral-200 p-4 dark:border-neutral-700">
              <h5 class="text-xl font-medium leading-normal ">
                {t("playlistDialog.title", { name: props.playlist.title })}
              </h5>
              <button
                onClick={() => props.onClose()}
                type="button"
                class="icon-button h-8 w-8 p-1"
                aria-label="Close"
              >
                <CrossIcon />
              </button>
            </div>
            <div class="flex h-full flex-col space-y-4 overflow-hidden p-4">
              <div class="relative h-full space-y-3 overflow-y-scroll">
                <Suspense
                  fallback={
                    <div class="flex h-full items-center justify-center">
                      <span class="h-16 w-16">
                        <CircularLoadingSpinner />
                      </span>
                    </div>
                  }
                >
                  <For each={songs()}>
                    {(song) => (
                      <button
                        class="flex w-full cursor-default items-center justify-between rounded-md bg-neutral-100 p-3 px-4 dark:bg-neutral-700"
                        classList={{
                          "hover:bg-neutral-200 dark:hover:bg-neutral-600 cursor-pointer":
                            !isInQueue(song),
                        }}
                        onClick={() => onSongSelect(song)}
                      >
                        <div class="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            class="h-4 w-4 rounded border-neutral-300 bg-neutral-100 text-custom-primary-600 dark:border-neutral-600 dark:bg-neutral-700"
                            checked={selected().includes(song)}
                            disabled={isInQueue(song)}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSongSelect(song);
                            }}
                          />
                          <Show when={song.thumbnail?.url}>
                            <img
                              class="border-1 h-10 w-10 rounded-full"
                              src={song.thumbnail.url}
                              alt="thumbnail"
                            />
                          </Show>
                          <div class="ml-4">
                            <h3 class="text-md text-left font-medium text-neutral-200">
                              {song.title}
                            </h3>
                          </div>
                        </div>
                      </button>
                    )}
                  </For>
                </Suspense>
              </div>
              <div class="flex">
                <div class="space-x-2">
                  <button
                    type="button"
                    class="ml-auto inline-flex shrink-0 items-center rounded border border-transparent bg-custom-primary-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-custom-primary-800 focus:outline-none focus:ring-2 focus:ring-custom-primary-500 focus:ring-offset-2 dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800 dark:focus:ring-custom-primary-500"
                    onClick={() => onSelectAll()}
                  >
                    {t("actions.selectAll")}
                  </button>
                  <button
                    type="button"
                    class="ml-auto inline-flex shrink-0 items-center rounded border border-transparent bg-custom-primary-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-custom-primary-800 focus:outline-none focus:ring-2 focus:ring-custom-primary-500 focus:ring-offset-2 dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800 dark:focus:ring-custom-primary-500"
                    onClick={() => setSelected([])}
                  >
                    {t("actions.clearSelections")}
                  </button>
                </div>
                <button
                  type="button"
                  class="ml-auto inline-flex shrink-0 items-center rounded border border-transparent bg-custom-primary-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-custom-primary-800 focus:outline-none focus:ring-2 focus:ring-custom-primary-500 focus:ring-offset-2 dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800 dark:focus:ring-custom-primary-500"
                  onClick={() => {
                    props.onSongAdd(selected());
                    props.onClose();
                  }}
                >
                  {t("actions.addSelected")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default PlaylistView;
