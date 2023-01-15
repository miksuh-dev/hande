import { useI18n } from "@solid-primitives/i18n";
import { SkipSongIcon } from "components/common/icon";
import Tooltip from "components/Tooltip";
import { Component, Show } from "solid-js";
import { Song, PlayingSong } from "trpc/types";
import { htmlDecode } from "utils/parse";
import SongImage from "../common/SongImage";
import Progress from "./Progress";
import YoutubeEmbedding from "./YoutubeEmbedding";

type Props = {
  playing: PlayingSong | undefined;
  showVideo: boolean;
  onSkip: (song: Song) => void;
};

const PlayingComponent: Component<Props> = (props) => {
  const [t] = useI18n();

  return (
    <div class="flex max-h-full min-h-[160px] items-center">
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
          <div class="w-full space-y-2">
            <div class="flex flex-row items-center justify-between">
              <div class="flex flex-row space-x-8">
                <Show
                  when={props.showVideo && song.type === "song"}
                  fallback={<SongImage song={song} />}
                >
                  <YoutubeEmbedding song={song} />
                </Show>
                <div class="flex flex-col justify-center py-4">
                  <h1>{htmlDecode(song.title)}</h1>
                  <p>
                    {t("common.requester")}: {song.requester}
                  </p>
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
