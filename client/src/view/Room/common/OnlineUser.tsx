import { Component, createMemo, Resource } from "solid-js";
import { RoomData } from "../data";
import { useRouteData } from "@solidjs/router";
import Username from "./Username";

type Props = {
  userHash: string;
};

const OnlineUser: Component<Props> = (props) => {
  const roomData = useRouteData<Resource<RoomData>>();

  const user = createMemo(() => {
    return roomData?.().users.find((user) => user.hash === props.userHash);
  });

  return <Username name={user().name} isMumbleUser={user().isMumbleUser} />;
};

export default OnlineUser;
