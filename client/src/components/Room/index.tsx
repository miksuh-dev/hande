import { Component } from "solid-js";
import { useRouteData } from "@solidjs/router";
import Users from "./Users";
import Chat from "./Chat";
import data from "view/Room/data";

export type RouteData = ReturnType<typeof data>;

const RoomViewComponent: Component = () => {
  const routeData = useRouteData<RouteData>();

  return (
    <div class="flex h-full w-full p-4">
      <div class="flex flex-1 flex-row space-x-4">
        <div class="flex flex-1 flex-col space-y-4">
          <Users users={routeData.room()?.users || []} />
          <Chat messages={routeData.messages} />
        </div>
        <div class="flex flex-1 flex-col space-y-4">
          <Users users={routeData.room()?.users || []} />
          <Chat messages={routeData.messages} />
        </div>
      </div>
    </div>
  );
};

export default RoomViewComponent;
