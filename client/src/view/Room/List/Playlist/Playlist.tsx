import { useI18n } from "@solid-primitives/i18n";
import {
  closestCorners,
  DragDropProvider,
  DragDropSensors,
  DragEvent,
  DragOverlay,
  SortableProvider,
} from "@thisbeyond/solid-dnd";
import useSnackbar from "hooks/useSnackbar";
import { Component, createMemo, createSignal, For } from "solid-js";
import trpcClient from "trpc";
import { Song } from "trpc/types";
import PlayListItem from "./PlaylistItem";

type Props = {
  songs: Song[];
  onSkip: (song: Song) => void;
  onPlayNext: (song: Song) => void;
};

const PlaylistComponent: Component<Props> = (props) => {
  const [t] = useI18n();
  const snackbar = useSnackbar();

  const [tempItems, setTempItems] = createSignal<Song[]>([]);

  const items = createMemo(() =>
    tempItems().length ? tempItems() : props.songs,
  );

  const ids = () => items().map((song) => song.id);

  const onDragEnd = async ({ draggable, droppable }: DragEvent) => {
    if (!draggable || !droppable) return;

    const currentItems = ids();
    const fromIndex = currentItems.indexOf(draggable.id as number);
    const toIndex = currentItems.indexOf(droppable.id as number);

    const diff = toIndex - fromIndex;
    if (!diff) return;

    const updatedItems = [...props.songs];
    updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));

    setTempItems(updatedItems);

    try {
      await trpcClient.room.movePosition.mutate({
        id: draggable.id as number,
        position: diff,
      });

      snackbar.success(t(`snackbar.common.movedSong`));
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(
          t("error.common", { error: t(err.message) || err.message }),
        );
      }
    } finally {
      setTempItems([]);
    }
  };

  return (
    <DragDropProvider onDragEnd={onDragEnd} collisionDetector={closestCorners}>
      <DragDropSensors />
      <div class="max-h-full space-y-2 overflow-y-auto pr-4 scrollbar">
        <SortableProvider ids={ids()}>
          <For each={items()}>
            {(song, index) => (
              <PlayListItem
                index={index}
                song={song}
                onSkip={props.onSkip}
                onPlayNext={props.onPlayNext}
              />
            )}
          </For>
        </SortableProvider>
      </div>
      <DragOverlay>
        <div class="sortable" />
      </DragOverlay>
    </DragDropProvider>
  );
};

export default PlaylistComponent;
