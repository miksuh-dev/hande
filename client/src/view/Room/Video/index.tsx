import { useRouteData } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { RoomData } from "../data";
import Video from "./Video";
import { SourceType } from "trpc/types";

const VideoComponent: Component = () => {
  const { room } = useRouteData<RoomData>();

  return (
    <Show when={room()?.playing?.type === SourceType.SONG}>
      <div class="flex-1 flex flex-col rounded-md bg-white dark:bg-neutral-900">
        <div class="overflow-hidden p-4 dark:bg-neutral-800 h-full">
          <Video playing={room().playing} />
        </div>
      </div>
    </Show>
  );
};

export default VideoComponent;
