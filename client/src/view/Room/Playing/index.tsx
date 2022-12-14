import { Song } from "trpc/types";
import { useRouteData } from "@solidjs/router";
import useSnackbar from "hooks/useSnackbar";
import { Component } from "solid-js";
import trpcClient from "trpc";
import { RoomData } from "../data";
import Playing from "./Playing";
import { htmlDecode } from "utils/parse";
import { useI18n } from "@solid-primitives/i18n";

const PlayingComponent: Component = () => {
  const [t] = useI18n();

  const roomData = useRouteData<RoomData>();
  const snackbar = useSnackbar();

  const handleSkip = async (song: Song) => {
    try {
      await trpcClient.room.skipCurrent.mutate({
        id: song.id,
      });

      snackbar.success(
        t(`snackbar.source.${song.type}.skipped`, {
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
    <div class="flex-0 flex  flex-col overflow-hidden rounded-md bg-white dark:bg-neutral-900">
      <div class="border-b border-neutral-300 dark:border-neutral-700">
        <div class="inline-block rounded-t-lg p-4 font-bold">
          {t("player.title")}:
        </div>
      </div>
      <div class="overflow-hidden p-4 dark:bg-neutral-800">
        <Playing playing={roomData().playing} onSkip={handleSkip} />
      </div>
    </div>
  );
};

export default PlayingComponent;
