import { Component, Resource } from "solid-js";
import { useRouteData } from "@solidjs/router";
import data from "view/Room/data";
import Playlist from "./Playlist";
import Social from "./Social";

export type RoomData = ReturnType<typeof data>;

const RoomViewComponent: Component = () => {
  const roomData = useRouteData<Resource<RoomData>>();

  if (!roomData) {
    return null;
  }
  return (
    <div class="flex h-full flex-1 flex-col space-y-4 overflow-hidden p-4 xl:flex-row xl:space-x-4 xl:space-y-0">
      <Playlist roomData={roomData} />
      <Social roomData={roomData} />
    </div>
  );
};

export default RoomViewComponent;
