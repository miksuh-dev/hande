import { Component, createSignal, Match, Resource, Switch } from "solid-js";
import Users from "./Users";
import Chat from "./Chat";
import { RoomData } from "../data";
import Tabs, { Tab } from "components/Tabs";
import { useRouteData } from "@solidjs/router";

const SocialComponent: Component = () => {
  const roomData = useRouteData<Resource<RoomData>>();

  const [selectedTab, setSelectedTab] = createSignal(0);

  return (
    <div class="flex h-full flex-1 flex-col rounded-md bg-white dark:bg-neutral-900">
      <div class="border-b border-neutral-300 dark:border-neutral-700">
        <Tabs>
          <Tab
            selected={selectedTab() === 0}
            onClick={() => setSelectedTab(0)}
            text="Chat"
          />
          <Tab
            selected={selectedTab() === 1}
            onClick={() => setSelectedTab(1)}
            text={
              <span class="flex items-center">
                <span class="mr-2">Käyttäjät</span>
                <span>{roomData?.()?.users?.length}</span>
              </span>
            }
          />
        </Tabs>
      </div>
      <div class="flex h-full w-full overflow-hidden p-3">
        <Switch>
          <Match when={selectedTab() === 0}>
            <Chat messages={roomData?.()?.messages || []} />
          </Match>
          <Match when={selectedTab() === 1}>
            <Users users={roomData?.()?.users || []} />
          </Match>
        </Switch>
      </div>
    </div>
  );
};

export default SocialComponent;
