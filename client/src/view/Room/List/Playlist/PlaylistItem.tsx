import { useI18n } from "@solid-primitives/i18n";
import { createSortable, useDragDropContext } from "@thisbeyond/solid-dnd";
import { CrossIcon, UpArrowIcon } from "components/common/icon";
import Tooltip from "components/Tooltip";
import { Component } from "solid-js";
import { Song } from "trpc/types";
import { htmlDecode } from "utils/parse";
import SongImage from "../../common/SongImage";

type Props = {
  song: Song;
  onPlayNext: (song: Song) => void;
  onSkip: (song: Song) => void;
};

const PlayListItem: Component<Props> = (props) => {
  const [t] = useI18n();

  // eslint-disable-next-line solid/reactivity
  const sortable = createSortable(props.song.id);
  const state = useDragDropContext();

  return (
    <div
      use:sortable
      class="flex cursor-grab flex-row items-center justify-between border border-neutral-200 p-4 shadow-md dark:border-neutral-700 dark:bg-neutral-800"
      classList={{
        "opacity-60": sortable.isActiveDraggable,
        "transition-transform": !!state?.[0].active.draggable,
      }}
    >
      <div class="flex flex-row space-x-8">
        <SongImage song={props.song} />
        <div class="flex flex-col py-4">
          <h1>{htmlDecode(props.song.title)}</h1>
          <p>
            {t("common.requester")}: {props.song.requester}
          </p>
        </div>
      </div>

      <div class="flex flex-row space-x-2 pr-2">
        <Tooltip text={t(`tooltip.source.${props.song.type}.playNext`)}>
          <button
            onClick={() => props.onPlayNext(props.song)}
            class="icon-button h-11 w-11"
          >
            <UpArrowIcon />
          </button>
        </Tooltip>
        <Tooltip text={t(`tooltip.source.${props.song.type}.skipInPlaylist`)}>
          <button
            onClick={() => props.onSkip(props.song)}
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
