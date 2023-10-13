import { useI18n } from "@solid-primitives/i18n";
import { CircularLoadingSpinner } from "components/common/icon";
import {
  Accessor,
  Component,
  createResource,
  createSignal,
  For,
  Suspense,
} from "solid-js";
import trpcClient from "trpc";
import { htmlDecode } from "utils/parse";
import { SearchResultPlaylist, SearchResultSong, Song } from "trpc/types";
import Tooltip from "components/Tooltip";
import SongThumbnail from "view/Room/common/SongThumbnail";
import Dialog from "components/Dialog";

type Props = {
  playlist: Accessor<SearchResultPlaylist>;
  playing: Song | undefined;
  songs: Song[];
  onSongAdd: (songs: SearchResultSong[]) => Promise<void>;
  onClose: () => void;
};

const PlaylistView: Component<Props> = (props) => {
  const [t] = useI18n();

  const [selected, setSelected] = createSignal<SearchResultSong[]>([]);

  const [songs] = createResource<SearchResultSong[]>(() =>
    trpcClient.room.listPlaylist.query({
      playlistId: props.playlist().contentId,
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
    <Dialog
      title={t("playlistDialog.title", {
        name: htmlDecode(props.playlist().title),
      })}
      onClose={() => props.onClose()}
      actions={
        <div class="flex">
          <div class="flex-1 space-x-2">
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
          <Tooltip
            text={t("tooltip.common.noSelections")}
            visible={selected().length === 0}
          >
            <button
              type="button"
              class="ml-auto inline-flex shrink-0 items-center rounded border border-transparent bg-custom-primary-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-custom-primary-800 focus:outline-none focus:ring-2 focus:ring-custom-primary-500 focus:ring-offset-2 dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800 dark:focus:ring-custom-primary-500"
              onClick={() => {
                props.onSongAdd(selected());
                props.onClose();
              }}
              disabled={selected().length === 0}
            >
              {t("actions.addSelected")}
            </button>
          </Tooltip>
        </div>
      }
    >
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
              class="card flex w-full cursor-default items-center justify-between p-2 px-4"
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
                <SongThumbnail song={song} />
                <div class="ml-4">
                  <h3 class="text-md text-left font-medium text-neutral-900 dark:text-neutral-200">
                    {htmlDecode(song.title)}
                  </h3>
                </div>
              </div>
            </button>
          )}
        </For>
      </Suspense>
    </Dialog>
  );
};

export default PlaylistView;
