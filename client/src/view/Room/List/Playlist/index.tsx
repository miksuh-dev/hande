import { useI18n } from "@solid-primitives/i18n";
import { useRouteData } from "@solidjs/router";
import { RandomIcon, ShuffleIcon, TrashIcon } from "components/common/icon";
import ConfirmDialog from "components/ConfirmDialog";
import { TabContainer } from "components/Tabs";
import Tooltip from "components/Tooltip";
import useSnackbar from "hooks/useSnackbar";
import { Component, createSignal, Show } from "solid-js";
import trpcClient from "trpc";
import { Song } from "trpc/types";
import { htmlDecode } from "utils/parse";
import type { RoomData } from "../../data";
import Playlist from "./Playlist";

const PlaylistComponent: Component = () => {
  const [t] = useI18n();

  const { room } = useRouteData<RoomData>();
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
        }),
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
        }),
      );
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(t("error.common", { error: err.message }));
      }
    }
  };

  const handleAddRandomSong = async () => {
    try {
      await trpcClient.room.addRandomSong.mutate();

      snackbar.success(t(`snackbar.common.addedRandom`));
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
    <>
      <TabContainer
        actions={
          <>
            <Tooltip text={t("tooltip.common.addRandomSong")}>
              <button class="icon-button" onClick={() => handleAddRandomSong()}>
                <RandomIcon />
              </button>
            </Tooltip>
            <Tooltip text={t("tooltip.common.shufflePlaylist")}>
              <button
                class="icon-button"
                onClick={() => handleShufflePlaylist()}
                disabled={room().songs.length === 0}
              >
                <ShuffleIcon />
              </button>
            </Tooltip>
            <Tooltip text={t("tooltip.common.clearPlaylist")}>
              <button
                class="icon-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setClearDialogOpen(true);
                }}
                disabled={room().songs.length === 0}
              >
                <TrashIcon />
              </button>
            </Tooltip>
          </>
        }
      >
        <Playlist
          songs={room().songs}
          onSkip={handleSkip}
          onPlayNext={handlePlayNext}
        />
      </TabContainer>
      <Show when={clearDialogOpen() && room().songs.length > 0}>
        <ConfirmDialog
          title={t("playlistClearDialog.title")}
          description={t("playlistClearDialog.description", {
            count: room().songs.length.toString(),
          })}
          onSubmit={() => {
            handleClearPlaylist();
            setClearDialogOpen(false);
          }}
          onCancel={() => setClearDialogOpen(false)}
        />
      </Show>
    </>
  );
};

export default PlaylistComponent;
