import { Song } from "trpc/types";
import { useRouteData } from "@solidjs/router";
import useSnackbar from "hooks/useSnackbar";
import { Component, createSignal } from "solid-js";
import trpcClient from "trpc";
import { RoomData } from "../data";
import Playing from "./Playing";
import { htmlDecode } from "utils/parse";
import { useI18n } from "@solid-primitives/i18n";
import Tooltip from "components/Tooltip";
import { EyeIcon, EyeSlashIcon } from "components/common/icon";

const PlayingComponent: Component = () => {
  const [t] = useI18n();
  const [showVideo, setShowVideo] = createSignal(false);

  const { room } = useRouteData<RoomData>();
  const snackbar = useSnackbar();

  const handleSkip = async (song: Song) => {
    try {
      const skippedSong = await trpcClient.room.skipCurrent.mutate({
        id: song.id,
      });

      snackbar.success(
        t(`snackbar.source.${skippedSong.type}.skipped`, {
          item: htmlDecode(skippedSong.title),
        })
      );
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(t("error.common", { error: err.message }));
      }
    }
  };

  return (
    <div class="flex-0 flex flex-col rounded-md bg-white dark:bg-neutral-900">
      <div class="flex border-b border-neutral-300 dark:border-neutral-700">
        <span class="flex-1 rounded-t-lg p-4 font-bold">
          {t("player.title")}:
        </span>
        <div class="flex items-center space-x-2 pr-4">
          <Tooltip
            text={
              showVideo()
                ? t("tooltip.common.hideVideo")
                : t("tooltip.common.showVideo")
            }
          >
            <button
              class="icon-button h-10 w-10"
              onClick={() => setShowVideo((current) => !current)}
            >
              {showVideo() ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </Tooltip>
        </div>
      </div>
      <div class="overflow-hidden p-4 dark:bg-neutral-800">
        <Playing
          playing={room().playing}
          showVideo={showVideo()}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
};

export default PlayingComponent;
