import { useI18n } from "@solid-primitives/i18n";
import { createSortable, useDragDropContext } from "@thisbeyond/solid-dnd";
import {
  CrossIcon,
  MoreIcon,
  RandomIcon,
  UpArrowIcon,
} from "components/common/icon";
import Tooltip from "components/Tooltip";
import { Accessor, Component, Show, createMemo, createSignal } from "solid-js";
import { SongClient, SongType } from "trpc/types";
import { htmlDecode } from "utils/parse";
import SongImage from "../../common/SongImage";
import PlaylistItemMenu from "./PlaylistItemMenu";

type Props = {
  song: SongClient;
  index: Accessor<number>;
  onPlayNext: (song: SongClient) => void;
  onSkip: (song: SongClient) => void;
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
  const [moreMenuOpen, setMoreMenuOpen] = createSignal(false);

  const song = createMemo(() => props.song);

  // eslint-disable-next-line solid/reactivity
  const sortable = createSortable(song().id);

  const state = useDragDropContext();

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
              <p>{getSongRequesterText(song())}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-row space-x-2 pr-2">
        <Tooltip
          text={t(`tooltip.source.${song().type}.playNext`)}
          closeOnClick
          visible={!moreMenuOpen()}
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
          closeOnClick
          visible={!moreMenuOpen()}
        >
          <button
            onClick={() => props.onSkip(song())}
            class="icon-button h-11 w-11"
          >
            <CrossIcon />
          </button>
        </Tooltip>
        <button
          disabled={props.song.type !== SongType.SONG}
          onClick={(event) => {
            event.stopPropagation();
            setMoreMenuOpen(!moreMenuOpen());
          }}
          class="icon-button h-11 w-11"
        >
          <MoreIcon />
          <PlaylistItemMenu
            open={moreMenuOpen}
            onClose={() => setMoreMenuOpen(false)}
            song={song}
          />
        </button>
      </div>
    </div>
  );
};

export default PlayListItem;
