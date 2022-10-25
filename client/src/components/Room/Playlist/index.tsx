import { Component } from "solid-js";
// import Users from "./Users";
// import Chat from "./Chat";
import { RoomData } from "../index";

const PlaylistComponent: Component<{ roomData: RoomData }> = (props) => {
  return (
    <div class="flex h-1 flex-1 flex-col bg-white xl:h-full">
      asd
      {/* <Chat messages={props.roomData()?.messages || []} /> */}
      {/* <Users users={props.roomData()?.users || []} /> */}
    </div>
  );
};

export default PlaylistComponent;
