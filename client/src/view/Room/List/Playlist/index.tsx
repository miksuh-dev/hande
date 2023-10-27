import { useI18n } from "@solid-primitives/i18n";
import { useRouteData } from "@solidjs/router";
import {
  RandomIcon,
  RobotIcon,
  ShuffleIcon,
  TrashIcon,
} from "components/common/icon";
import ConfirmDialog from "components/ConfirmDialog";
import { TabContainer } from "components/Tabs";
import { getTimeLeft } from "./utils";
import Tooltip from "components/Tooltip";
import useSnackbar from "hooks/useSnackbar";
import {
  Component,
  createEffect,
  createSignal,
  onCleanup,
  Show,
} from "solid-js";
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
  const [autoplayLeft, setAutoplayLeft] = createSignal<number>();

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
        snackbar.error(
          t("error.common", { error: t(err.message) || err.message }),
        );
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

  const handleAutoplay = async () => {
    try {
      const autoPlayOn = await trpcClient.room.autoplay.mutate();

      snackbar.success(
        autoPlayOn
          ? t(`snackbar.common.autoplayOn`)
          : t(`snackbar.common.autoplayOff`),
      );
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(t("error.common", { error: err.message }));
      }
    }
  };

  createEffect(() => {
    const time = room().room.autoplay?.time;

    if (!time) {
      setAutoplayLeft(0);
      return;
    }

    setAutoplayLeft(getTimeLeft(time));

    const interval = setInterval(() => {
      setAutoplayLeft(getTimeLeft(time));
    }, 3000);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

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
            <Tooltip
              text={
                room().room.autoplay
                  ? t("tooltip.common.autoplayOff")
                  : t("tooltip.common.autoplayOn")
              }
            >
              <button class="icon-button" onClick={() => handleAutoplay()}>
                <div class="relative">
                  <RobotIcon />
                  <Show when={autoplayLeft()}>
                    {(autoplay) => (
                      <span class="text-[0.5rem] rounded-md text-white dark:text-custom-primary-500 absolute left-0 right-0 -bottom-2">
                        {`${Math.round(autoplay())} min`}
                      </span>
                    )}
                  </Show>
                </div>
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
