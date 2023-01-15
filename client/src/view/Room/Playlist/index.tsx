import { useI18n } from "@solid-primitives/i18n";
import { useRouteData } from "@solidjs/router";
import { ShuffleIcon, TrashIcon } from "components/common/icon";
import ConfirmDialog from "components/ConfirmDialog";
import Tooltip from "components/Tooltip";
import useSnackbar from "hooks/useSnackbar";
import { Component, createSignal, Show } from "solid-js";
import trpcClient from "trpc";
import { Song } from "trpc/types";
import { htmlDecode } from "utils/parse";
import type { RoomData } from "../data";
import Playlist from "./Playlist";

const PlaylistComponent: Component = () => {
  const [t] = useI18n();

  const roomData = useRouteData<RoomData>();
  const [clearDialogOpen, setClearDialogOpen] = createSignal(false);

  const snackbar = useSnackbar();

  const handleSkip = async (song: Song) => {
    try {
      const skippedSong = await trpcClient.room.removeSong.mutate({
        id: song.id,
      });

      snackbar.success(
        t(`snackbar.source.${skippedSong.type}.skippedInPlaylist`, {
          item: htmlDecode(skippedSong.title),
        })
      );
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(t("error.common", { error: err.message }));
      }
    }
  };

  const handlePlayNext = async (song: Song) => {
    try {
      await trpcClient.room.playNext.mutate({
        id: song.id,
      });

      snackbar.success(
        t(`snackbar.source.${song.type}.setAsNext`, {
          item: htmlDecode(song.title),
        })
      );
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(t("error.common", { error: err.message }));
      }
    }
  };

  const handleShufflePlaylist = async () => {
    try {
      await trpcClient.room.shufflePlaylist.mutate();

      snackbar.success(t(`snackbar.common.shuffledPlaylist`));
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(t("error.common", { error: err.message }));
      }
    }
  };

  const handleClearPlaylist = async () => {
    try {
      await trpcClient.room.clearPlaylist.mutate();

      snackbar.success(t(`snackbar.common.clearedPlaylist`));
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(t("error.common", { error: err.message }));
      }
    }
  };

  return (
    <div class="flex h-1 flex-1 flex-col overflow-hidden rounded-md bg-white dark:bg-neutral-900 xl:h-full">
      <div class="flex border-b border-neutral-300 dark:border-neutral-700">
        <span class="inline-block flex-1 rounded-t-lg p-4 font-bold">
          {t("playlist.title")}:
        </span>
        <div class="flex items-center space-x-2 pr-4">
          <Tooltip text={t("tooltip.common.shufflePlaylist")}>
            <button
              class="icon-button h-10 w-10"
              onClick={() => handleShufflePlaylist()}
              disabled={roomData().songs.length === 0}
            >
              <ShuffleIcon />
            </button>
          </Tooltip>
          <Tooltip text={t("tooltip.common.clearPlaylist")}>
            <button
              class="icon-button h-10 w-10"
              onClick={(e) => {
                e.stopPropagation();
                setClearDialogOpen(true);
              }}
              disabled={roomData().songs.length === 0}
            >
              <TrashIcon />
            </button>
          </Tooltip>
        </div>
      </div>
      <div class="overflow-hidden p-4 pr-0">
        <Playlist
          songs={roomData().songs}
          onSkip={handleSkip}
          onPlayNext={handlePlayNext}
        />
      </div>
      <Show when={clearDialogOpen() && roomData().songs.length > 0}>
        <ConfirmDialog
          title={t("playlistClearDialog.title")}
          description={t("playlistClearDialog.description", {
            count: roomData().songs.length.toString(),
          })}
          onSubmit={() => {
            handleClearPlaylist();
            setClearDialogOpen(false);
          }}
          onCancel={() => setClearDialogOpen(false)}
        />
      </Show>
    </div>
  );
};

export default PlaylistComponent;
