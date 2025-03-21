import { useI18n } from "@solid-primitives/i18n";
import {
  ChatBubbleIcon,
  CircularLoadingSpinner,
  EyeIcon,
  EyeSlashIcon,
  LyricsIcon,
  LyricsSlashIcon,
  RandomIcon,
  SkipSongIcon,
  ThumbDownIcon,
  ThumbUpIcon,
} from "components/common/icon";
import Tooltip from "components/Tooltip";
import {
  Accessor,
  Component,
  Show,
  Setter,
  createSignal,
  createEffect,
  on,
  createMemo,
} from "solid-js";
import {
  SongClient,
  PlayState,
  SongType,
  PlayingSongClient,
  LyricsItem,
} from "trpc/types";
import { htmlDecode } from "utils/parse";
import { VoteType } from "trpc/types";
import Progress from "./Progress";
import VolumeControl from "./VolumeControl";
import SongThumbnail from "view/Room/common/SongThumbnail";
import { hasSongDetails, secondsToTime } from "./utils";
import type { RoomData } from "view/Room/data";
import { useRouteData } from "@solidjs/router";
import useSnackbar from "hooks/useSnackbar";
import trpcClient from "trpc";

type Props = {
  showVideo: Accessor<boolean>;
  showSocial: Accessor<boolean>;
  setShowVideo: Setter<boolean>;
  setLyrics: Setter<LyricsItem | undefined>;
  lyrics: Accessor<LyricsItem | undefined>;
  setShowSocial: Setter<boolean>;
};

const PlayingComponent: Component<Props> = (props) => {
  const { room } = useRouteData<RoomData>();

  const [t] = useI18n();

  const snackbar = useSnackbar();

  const [progress, setProgress] = createSignal<number>(0);

  const title = createMemo(() => room()?.playing?.title);

  const [loading, setLoading] = createSignal(false);

  createEffect(
    on(title, () => {
      props.setLyrics(undefined);
      setProgress(0);

      const titleRaw = title();
      document.title = titleRaw ? `${htmlDecode(titleRaw)} | Hande` : "Hande";
    })
  );

  const handleSkip = async (song: PlayingSongClient) => {
    try {
      setLoading(true);
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
        snackbar.error(
          t("error.common", { error: t(err.message) || err.message })
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (song: SongClient, vote: VoteType) => {
    try {
      setLoading(true);
      await trpcClient.room.voteSong.mutate({
        songId: song.id,
        contentId: song.contentId,
        vote,
      });

      snackbar.success(t("snackbar.common.voted"));
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(t(err.message) ?? err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGetLyrics = async (song: PlayingSongClient<SongType.SONG>) => {
    try {
      setLoading(true);
      const result = await trpcClient.room.getCurrentLyrics.query({
        songId: song.contentId,
      });

      props.setLyrics(result);
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(
          t("error.common", { error: t(err.message) || err.message })
        );
      }

      props.setLyrics(undefined);
    } finally {
      setLoading(false);
    }
  };

  const getSongRequesterText = (song: SongClient) => {
    if ("originalRequester" in song && song.originalRequester) {
      return t("common.requesterWithOriginal", {
        requester: song.requester,
        original: song.originalRequester,
      });
    }

    return `${t("common.requester")}: ${song.requester}`;
  };

  return (
    <div class="flex">
      <Show when={room().playing}>
        {(song) => (
          <div class="flex w-full flex-col bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-100">
            <Show when={song().type === SongType.SONG}>
              <Progress
                progress={progress}
                setProgress={setProgress}
                playing={song as Accessor<PlayingSongClient<SongType.SONG>>}
              />
            </Show>
            <div class="flex justify-between px-3 py-2 items-center space-x-4 flex-col sm:flex-row">
              <div class="flex space-x-4 flex-1 min-w-min">
                <div class="items-center flex space-x-4">
                  <Show when={song().random}>
                    <Tooltip text={t("tooltip.common.randomSong")}>
                      <RandomIcon />
                    </Tooltip>
                  </Show>
                  <div class="w-10 h-10">
                    <div class="relative">
                      <SongThumbnail song={song()} />
                      <Show when={song().state === PlayState.STARTING}>
                        <div class="absolute left-0 top-0 right-0 bottom-0">
                          <CircularLoadingSpinner />
                        </div>
                      </Show>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 class="whitespace-nowrap">{htmlDecode(song().title)}</h1>
                  <p class="whitespace-nowrap">
                    {getSongRequesterText(song())}
                  </p>
                </div>
              </div>
              <div class="space-x-2 flex justify-center">
                <Show when={song().type === SongType.SONG}>
                  <Tooltip
                    text={
                      props.showVideo()
                        ? t("tooltip.common.hideVideo")
                        : t("tooltip.common.showVideo")
                    }
                  >
                    <button
                      class="icon-button w-12 h-12 p-1"
                      onClick={() => props.setShowVideo((current) => !current)}
                    >
                      {props.showVideo() && song().type === SongType.SONG ? (
                        <EyeSlashIcon />
                      ) : (
                        <EyeIcon />
                      )}
                    </button>
                  </Tooltip>
                </Show>
                <Show when={song().type === SongType.SONG}>
                  <Tooltip
                    text={
                      !hasSongDetails(
                        song() as PlayingSongClient<SongType.SONG>
                      )
                        ? t("tooltip.common.noSongDetails")
                        : props.lyrics()
                        ? t("tooltip.common.hideLyrics")
                        : t("tooltip.common.showLyrics")
                    }
                  >
                    <button
                      class="icon-button w-12 h-12 p-1"
                      onClick={() => {
                        !props.lyrics()
                          ? handleGetLyrics(
                              song() as PlayingSongClient<SongType.SONG>
                            )
                          : props.setLyrics(undefined);
                      }}
                      disabled={
                        !hasSongDetails(
                          song() as PlayingSongClient<SongType.SONG>
                        ) || loading()
                      }
                    >
                      {props.lyrics() ? <LyricsSlashIcon /> : <LyricsIcon />}
                    </button>
                  </Tooltip>
                </Show>
                <VolumeControl playing={song()} />
                <div class="space-x-2 w-max flex items-center ">
                  <button
                    disabled={loading()}
                    onClick={() =>
                      handleVote(
                        song(),
                        song()?.vote === VoteType.UP
                          ? VoteType.NONE
                          : VoteType.UP
                      )
                    }
                    classList={{
                      "text-green-500 dark:text-green-500":
                        song()?.vote === VoteType.UP,
                      "text-custom-primary-800 dark:text-custom-primary-800":
                        song()?.vote !== VoteType.UP,
                    }}
                    class="icon-button w-12 h-12 p-1"
                  >
                    <ThumbUpIcon />
                  </button>
                  <span
                    class="text-xl bold"
                    classList={{
                      "text-green-500 dark:text-green-500": song().rating > 0,
                      "text-red-500 dark:text-red-500": song().rating < 0,
                      "text-neutral-700 dark:text-white": song().rating === 0,
                    }}
                  >
                    {song().rating ?? 0}
                  </span>
                  <button
                    disabled={loading()}
                    onClick={() =>
                      handleVote(
                        song(),
                        song()?.vote === VoteType.DOWN
                          ? VoteType.NONE
                          : VoteType.DOWN
                      )
                    }
                    classList={{
                      "text-red-500 dark:text-red-500":
                        song()?.vote === VoteType.DOWN,
                      "text-custom-primary-800 dark:text-custom-primary-800":
                        song()?.vote !== VoteType.DOWN,
                    }}
                    class="icon-button w-12 h-12 p-1"
                  >
                    <ThumbDownIcon />
                  </button>
                </div>
                <Tooltip text={t(`tooltip.source.${song().type}.skip`)}>
                  <button
                    onClick={() => handleSkip(song())}
                    class="icon-button w-12 h-12 p-1"
                    disabled={song().state === PlayState.ENDED || loading()}
                  >
                    <SkipSongIcon />
                  </button>
                </Tooltip>
              </div>
              <div class="flex flex-1 justify-end space-x-2">
                <Show when={"duration" in song()}>
                  <div class="space-x-1 self-center">
                    <span>{secondsToTime(progress())}</span>
                    <span>/</span>
                    <span>
                      {secondsToTime(
                        (song() as PlayingSongClient<SongType.SONG>).duration
                      )}
                    </span>
                  </div>
                </Show>
                <div class="xl:hidden">
                  <button
                    class="icon-button w-12 h-12 p-1"
                    onClick={() => props.setShowSocial(!props.showSocial())}
                  >
                    <ChatBubbleIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
};

export default PlayingComponent;
