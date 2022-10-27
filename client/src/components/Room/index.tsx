import { Component, Resource } from "solid-js";
import { useRouteData } from "@solidjs/router";
import data from "view/Room/data";
import Playlist from "./Playlist";
import Playing from "./Playing";
import Social from "./Social";
import Search from "./Search";

export type RoomData = ReturnType<typeof data>;

const RoomViewComponent: Component = () => {
  const roomData = useRouteData<Resource<RoomData>>();

  if (!roomData) {
    return null;
  }
  return (
    <div class="flex flex-1 flex-col space-y-4 overflow-hidden p-4 xl:flex-row xl:space-x-4 xl:space-y-0">
      <div class="flex h-1 flex-1 flex-col space-y-4 xl:h-full">
        <Search />
        <Playing roomData={roomData} />
        <Playlist roomData={roomData} />
      </div>
      <Social roomData={roomData} />
    </div>
  );
};

export default RoomViewComponent;
