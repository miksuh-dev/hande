import { Component, createSignal, Match, Switch } from "solid-js";
import Users from "./Users";
import Chat from "./Chat";
import { RoomData } from "../data";
import Tabs, { Tab } from "components/Tabs";
import { useRouteData } from "@solidjs/router";
import { useI18n } from "@solid-primitives/i18n";

const SocialComponent: Component = () => {
  const [t] = useI18n();

  const { room } = useRouteData<RoomData>();

  const [selectedTab, setSelectedTab] = createSignal(0);

  return (
    <div class="flex h-full flex-1 flex-col rounded-md bg-white dark:bg-neutral-900">
      <Tabs>
        <Tab
          selected={selectedTab() === 0}
          onClick={() => setSelectedTab(0)}
          text={t("chat.title")}
        />
        <Tab
          selected={selectedTab() === 1}
          onClick={() => setSelectedTab(1)}
          text={
            <span class="flex items-center">
              <span class="mr-2">{t("users.title")}</span>
              <span>{room().users.length}</span>
            </span>
          }
        />
      </Tabs>
      <div class="flex h-full w-full overflow-hidden p-3">
        <Switch>
          <Match when={selectedTab() === 0}>
            <Chat messages={room().messages} />
          </Match>
          <Match when={selectedTab() === 1}>
            <Users users={room().users} />
          </Match>
        </Switch>
      </div>
    </div>
  );
};

export default SocialComponent;
