import { useI18n } from "@solid-primitives/i18n";
import {
  RandomIcon,
  SkipSongIcon,
  ThumbDownIcon,
  ThumbUpIcon,
} from "components/common/icon";
import Tooltip from "components/Tooltip";
import { Component, Show } from "solid-js";
import { Song, PlayingSong } from "trpc/types";
import { htmlDecode } from "utils/parse";
import { VoteType } from "trpc/types";
import SongImage from "../common/SongImage";
import Progress from "./Progress";
import YoutubeEmbedding from "./YoutubeEmbedding";

type Props = {
  playing: PlayingSong | undefined;
  showVideo: boolean;
  onSkip: (song: Song) => void;
  onVote: (songId: number, contentId: string, vote: VoteType) => void;
};

const PlayingComponent: Component<Props> = (props) => {
  const [t] = useI18n();

  return (
    <div class="flex max-h-full min-h-[160px] items-center ">
      <Show
        when={props.playing}
        fallback={
          <div class="flex-1 flex-col justify-center text-center">
            <h5 class="text-xl">{t("player.empty.title")}</h5>
            <p>{t("player.empty.subtitle")}</p>
          </div>
        }
      >
        {(song: PlayingSong) => (
          <div
            class="flex w-full flex-col space-y-4"
            style={{ "min-height": "inherit" }}
          >
            <div class="flex flex-1 flex-row items-center justify-between space-y-2">
              <div class="flex h-full flex-row space-x-8">
                <Show
                  when={props.showVideo && song.type === "song"}
                  fallback={<SongImage song={song} />}
                >
                  <YoutubeEmbedding song={song} />
                </Show>
                <div class="flex justify-center">
                  <div class="flex flex-col justify-between">
                    <div class="flex flex-col justify-center py-4">
                      <div class="flex flex-row space-x-4 ">
                        <Show when={song.random}>
                          <div class="flex items-center">
                            <span class="h-10 w-10">
                              <Tooltip text={t("tooltip.common.randomSong")}>
                                <RandomIcon />
                              </Tooltip>
                            </span>
                          </div>
                        </Show>
                        <div>
                          <h1>{htmlDecode(song.title)}</h1>
                          <p>
                            {t("common.requester")}: {song.requester}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="p-2 space-x-2 w-max flex items-center ">
                      <button
                        onClick={() =>
                          props.onVote(song.id, song.contentId, VoteType.UP)
                        }
                        classList={{
                          "text-green-500 dark:text-green-500":
                            song?.vote === VoteType.UP,
                          "text-neutral-900 dark:text-neutral-300":
                            song?.vote !== VoteType.UP,
                        }}
                        class="icon-button h-10 w-10"
                      >
                        <ThumbUpIcon />
                      </button>
                      <span
                        class="text-xl bold"
                        classList={{
                          "dark:text-green-500": song.rating > 0,
                          "dark:text-red-500": song.rating < 0,
                          "dark:text-white": song.rating === 0,
                        }}
                      >
                        {song.rating}
                      </span>
                      <button
                        onClick={() =>
                          props.onVote(song.id, song.contentId, VoteType.DOWN)
                        }
                        classList={{
                          "text-red-500 dark:text-red-500":
                            song?.vote === VoteType.DOWN,
                          "text-neutral-900 dark:text-neutral-300":
                            song?.vote !== VoteType.DOWN,
                        }}
                        class="icon-button h-10 w-10"
                      >
                        <ThumbDownIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pr-2">
                <Tooltip text={t(`tooltip.source.${song.type}.skip`)}>
                  <button
                    onClick={() => props.onSkip(song)}
                    class="icon-button h-12 w-12"
                  >
                    <SkipSongIcon />
                  </button>
                </Tooltip>
              </div>
            </div>
            <Show when={song.duration}>
              <Progress playing={song} />
            </Show>
          </div>
        )}
      </Show>
    </div>
  );
};

export default PlayingComponent;
