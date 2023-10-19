import { useI18n } from "@solid-primitives/i18n";
import {
  EyeIcon,
  EyeSlashIcon,
  RandomIcon,
  SkipSongIcon,
  ThumbDownIcon,
  ThumbUpIcon,
} from "components/common/icon";
import Tooltip from "components/Tooltip";
import { Accessor, Component, Show, Setter, createSignal } from "solid-js";
import { Song, PlayingTypeSong, SourceType } from "trpc/types";
import { htmlDecode } from "utils/parse";
import { VoteType } from "trpc/types";
import Progress from "./Progress";
import VolumeControl from "./VolumeControl";
import SongThumbnail from "view/Room/common/SongThumbnail";
import { secondsToTime } from "./utils";
import type { RoomData } from "view/Room/data";
import { useRouteData } from "@solidjs/router";

type Props = {
  showVideo: Accessor<boolean>;
  setShowVideo: Setter<boolean>;
  onSkip: (song: Song) => void;
  onVote: (song: Song, vote: VoteType) => void;
};

const PlayingComponent: Component<Props> = (props) => {
  const { room } = useRouteData<RoomData>();

  const [t] = useI18n();

  const [progress, setProgress] = createSignal<number>(0);

  return (
    <div class="flex bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-100">
      <Show when={room().playing}>
        {(song) => (
          <div class="flex w-full flex-col">
            <Show when={song().type === "song"}>
              <Progress
                progress={progress}
                setProgress={setProgress}
                playing={song as Accessor<PlayingTypeSong>}
              />
            </Show>
            <div class="flex justify-between px-4 py-2 items-center space-x-4 flex-col sm:flex-row">
              <div class="flex space-x-4 flex-1 min-w-min">
                <div class="items-center flex space-x-4">
                  <Show when={song().random}>
                    <Tooltip text={t("tooltip.common.randomSong")}>
                      <RandomIcon />
                    </Tooltip>
                  </Show>
                  <div class="w-10 h-10">
                    <SongThumbnail song={song()} />
                  </div>
                </div>
                <div>
                  <h1 class="whitespace-nowrap">{htmlDecode(song().title)}</h1>
                  <p class="whitespace-nowrap">
                    <Show
                      when={song().originalRequester}
                      fallback={`${t("common.requester")}: ${song().requester}`}
                    >
                      {(originalRequester) =>
                        t("common.requesterWithOriginal", {
                          requester: song().requester,
                          original: originalRequester(),
                        })
                      }
                    </Show>
                  </p>
                </div>
              </div>
              <div class="space-x-2 flex justify-center">
                <Tooltip
                  text={
                    props.showVideo()
                      ? t("tooltip.common.hideVideo")
                      : t("tooltip.common.showVideo")
                  }
                >
                  <button
                    class="icon-button"
                    onClick={() => props.setShowVideo((current) => !current)}
                    disabled={song().type === SourceType.RADIO}
                  >
                    {props.showVideo() && song().type === SourceType.SONG ? (
                      <EyeSlashIcon />
                    ) : (
                      <EyeIcon />
                    )}
                  </button>
                </Tooltip>
                <VolumeControl playing={song()} />
                <div class="space-x-2 w-max flex items-center ">
                  <button
                    onClick={() =>
                      props.onVote(
                        song(),
                        song()?.vote === VoteType.UP
                          ? VoteType.NONE
                          : VoteType.UP,
                      )
                    }
                    classList={{
                      "text-green-500 dark:text-green-500":
                        song()?.vote === VoteType.UP,
                      "text-custom-primary-800 dark:text-custom-primary-800":
                        song()?.vote !== VoteType.UP,
                    }}
                    class="icon-button"
                  >
                    <ThumbUpIcon />
                  </button>
                  <span
                    class="text-xl bold"
                    classList={{
                      "dark:text-green-500": song().rating > 0,
                      "dark:text-red-500": song().rating < 0,
                      "dark:text-white": song().rating === 0,
                    }}
                  >
                    {song().rating}
                  </span>
                  <button
                    onClick={() =>
                      props.onVote(
                        song(),
                        song()?.vote === VoteType.DOWN
                          ? VoteType.NONE
                          : VoteType.DOWN,
                      )
                    }
                    classList={{
                      "text-red-500 dark:text-red-500":
                        song()?.vote === VoteType.DOWN,
                      "text-custom-primary-800 dark:text-custom-primary-800":
                        song()?.vote !== VoteType.DOWN,
                    }}
                    class="icon-button"
                  >
                    <ThumbDownIcon />
                  </button>
                </div>
                <Tooltip text={t(`tooltip.source.${song().type}.skip`)}>
                  <button
                    onClick={() => props.onSkip(song())}
                    class="icon-button h-10 w-10 p-1"
                  >
                    <SkipSongIcon />
                  </button>
                </Tooltip>
              </div>
              <div class="flex flex-1 justify-end">
                <Show when={song().duration}>
                  {(duration) => (
                    <div class="space-x-1 self-center">
                      <span>{secondsToTime(progress())}</span>
                      <span>/</span>
                      <span>{secondsToTime(duration())}</span>
                    </div>
                  )}
                </Show>
              </div>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
};

export default PlayingComponent;
