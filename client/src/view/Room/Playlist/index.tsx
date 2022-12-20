import { useI18n } from "@solid-primitives/i18n";
import { useRouteData } from "@solidjs/router";
import useSnackbar from "hooks/useSnackbar";
import { Component } from "solid-js";
import trpcClient from "trpc";
import { Song } from "trpc/types";
import { htmlDecode } from "utils/parse";
import type { RoomData } from "../data";
import Playlist from "./Playlist";

const PlaylistComponent: Component = () => {
  const [t] = useI18n();

  const roomData = useRouteData<RoomData>();

  const snackbar = useSnackbar();

  const handleSkip = async (song: Song) => {
    try {
      await trpcClient.room.removeSong.mutate({
        id: song.id,
      });

      snackbar.success(
        t(`snackbar.source.${song.type}.skippedInPlaylist`, {
          item: htmlDecode(song.title),
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

  return (
    <div class="flex h-1 flex-1 flex-col overflow-hidden rounded-md bg-white dark:bg-neutral-900 xl:h-full">
      <div class="border-b border-neutral-300 dark:border-neutral-700">
        <div class="inline-block rounded-t-lg p-4 font-bold">
          {t("playlist.title")}:
        </div>
      </div>
      <div class="overflow-hidden p-4 pr-0">
        <Playlist
          songs={roomData().songs}
          onSkip={handleSkip}
          onPlayNext={handlePlayNext}
        />
      </div>
    </div>
  );
};

export default PlaylistComponent;
