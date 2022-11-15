import { Component } from "solid-js";
import Content from "components/Content";
import Playlist from "./Playlist";
import Playing from "./Playing";
import Social from "./Social";
import Search from "./Search";

const RoomView: Component = () => {
  return (
    <Content>
      <div class="flex flex-1 flex-col space-y-4 overflow-hidden p-4 dark:text-neutral-100  xl:flex-row xl:space-x-4 xl:space-y-0">
        <div class="flex h-1 flex-1 flex-col space-y-4 xl:h-full">
          <Search />
          <Playing />
          <Playlist />
        </div>
        <Social />
      </div>
    </Content>
  );
};

export default RoomView;
