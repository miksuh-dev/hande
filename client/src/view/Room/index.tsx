import { Component, Show } from "solid-js";
import Content from "components/Content";
import List from "./List";
import Playing from "./Playing";
import Social from "./Social";
import Search from "./Search";
import Loading from "components/Loading";
import { useRouteData } from "@solidjs/router";
import { RoomData } from "./data";
import { useI18n } from "@solid-primitives/i18n";

const RoomView: Component = () => {
  const [t] = useI18n();
  const { reconnecting } = useRouteData<RoomData>();

  return (
    <Content>
      <Show
        when={reconnecting()}
        fallback={
          <div class="flex flex-1 flex-col overflow-hidden p-4 dark:text-neutral-100  xl:flex-row xl:space-x-4 xl:space-y-0">
            <div class="z-10 flex h-1 flex-1 flex-col space-y-4 xl:h-full">
              <Search />
              <Playing />
              <List />
            </div>
            <Social />
          </div>
        }
      >
        <Loading title={t("error.socketReconnecting")} />
      </Show>
    </Content>
  );
};

export default RoomView;
