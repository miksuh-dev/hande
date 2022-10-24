import { Component, Resource } from "solid-js";
import { useRouteData } from "@solidjs/router";
import data from "view/Room/data";
import Social from "./Social";

export type RoomData = ReturnType<typeof data>;

const RoomViewComponent: Component = () => {
  const roomData = useRouteData<Resource<RoomData>>();

  if (!roomData) {
    return null;
  }
  return (
    <div class="flex h-full flex-1 flex-row space-x-4 overflow-hidden p-4">
      <Social roomData={roomData} />
      <Social roomData={roomData} />
    </div>
  );
};

export default RoomViewComponent;
