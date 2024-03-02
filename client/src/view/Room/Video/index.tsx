import { useRouteData } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { RoomData } from "../data";
import Video from "./Video";
import { SongType } from "trpc/types";

const VideoComponent: Component = () => {
  const { room } = useRouteData<RoomData>();

  return (
    <Show when={room()?.playing?.type === SongType.SONG}>
      <div class="flex-1 flex flex-col p-4 rounded-md bg-white dark:bg-neutral-900">
        <Video playing={room().playing} />
      </div>
    </Show>
  );
};

export default VideoComponent;
