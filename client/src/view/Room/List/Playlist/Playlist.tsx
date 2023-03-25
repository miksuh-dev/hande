import { useI18n } from "@solid-primitives/i18n";
import { CrossIcon, UpArrowIcon } from "components/common/icon";
import Tooltip from "components/Tooltip";
import { Component, For } from "solid-js";
import { Song } from "trpc/types";
import { htmlDecode } from "utils/parse";
import SongImage from "../../common/SongImage";

type Props = {
  onSkip: (song: Song) => void;
  onPlayNext: (song: Song) => void;
  songs?: Song[];
};

const PlaylistComponent: Component<Props> = (props) => {
  const [t] = useI18n();

  return (
    <div class="max-h-full space-y-4 overflow-y-auto rounded-md pr-4">
      <For each={props.songs}>
        {(song) => (
          <div class="flex flex-row items-center justify-between border border-neutral-200 p-4 shadow-md dark:border-neutral-700 dark:bg-neutral-800">
            <div class="flex flex-row space-x-8">
              <SongImage song={song} />
              <div class="flex flex-col py-4">
                <h1>{htmlDecode(song.title)}</h1>
                <p>
                  {t("common.requester")}: {song.requester}
                </p>
              </div>
            </div>

            <div class="flex flex-row space-x-2 pr-2">
              <Tooltip text={t(`tooltip.source.${song.type}.playNext`)}>
                <button
                  onClick={() => props.onPlayNext(song)}
                  class="icon-button h-11 w-11"
                >
                  <UpArrowIcon />
                </button>
              </Tooltip>
              <Tooltip text={t(`tooltip.source.${song.type}.skipInPlaylist`)}>
                <button
                  onClick={() => props.onSkip(song)}
                  class="icon-button h-11 w-11"
                >
                  <CrossIcon />
                </button>
              </Tooltip>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default PlaylistComponent;
