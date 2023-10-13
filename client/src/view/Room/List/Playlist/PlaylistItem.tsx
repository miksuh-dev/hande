import { useI18n } from "@solid-primitives/i18n";
import { createSortable, useDragDropContext } from "@thisbeyond/solid-dnd";
import { CrossIcon, RandomIcon, UpArrowIcon } from "components/common/icon";
import Tooltip from "components/Tooltip";
import { Accessor, Component, Show, createMemo } from "solid-js";
import { Song } from "trpc/types";
import { htmlDecode } from "utils/parse";
import SongImage from "../../common/SongImage";

type Props = {
  song: Song;
  index: Accessor<number>;
  onPlayNext: (song: Song) => void;
  onSkip: (song: Song) => void;
};

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      sortable: boolean;
    }
  }
}

const PlayListItem: Component<Props> = (props) => {
  const [t] = useI18n();

  const song = createMemo(() => props.song);

  // eslint-disable-next-line solid/reactivity
  const sortable = createSortable(song().id);

  const state = useDragDropContext();

  return (
    <div
      use:sortable
      class="card flex cursor-grab flex-row items-center justify-between p-3"
      classList={{
        "opacity-60": sortable.isActiveDraggable,
        "transition-transform": !!state?.[0].active.draggable,
      }}
    >
      <div class="flex flex-row space-x-8">
        <SongImage song={song} size={"small"} />
        <div class="flex select-none flex-col py-4 justify-center">
          <div class="flex flex-row space-x-4">
            <Show when={song().random}>
              <div class="flex flex-row space-x-2 items-center">
                <span class="h-8 w-8">
                  <Tooltip text={t("tooltip.common.randomSong")}>
                    <RandomIcon />
                  </Tooltip>
                </span>
              </div>
            </Show>
            <div>
              <h1>{htmlDecode(song().title)}</h1>
              <p>
                {t("common.requester")}: {song().requester}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-row space-x-2 pr-2">
        <Tooltip
          text={t(`tooltip.source.${song().type}.playNext`)}
          destroyOnClick
        >
          <button
            onClick={() => props.onPlayNext(song())}
            class="icon-button h-11 w-11"
          >
            <UpArrowIcon />
          </button>
        </Tooltip>
        <Tooltip
          text={t(`tooltip.source.${song().type}.skipInPlaylist`)}
          destroyOnClick
        >
          <button
            onClick={() => props.onSkip(song())}
            class="icon-button h-11 w-11"
          >
            <CrossIcon />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default PlayListItem;
