import { Component, createSignal, Match, Switch } from "solid-js";
import Users from "./Users";
import Chat from "./Chat";
import { RoomData } from "../index";
import Tabs, { Tab } from "components/Tabs";

const SocialComponent: Component<{ roomData: RoomData }> = (props) => {
  const [selectedTab, setSelectedTab] = createSignal(0);

  return (
    <div class="flex flex-1 flex-col bg-white">
      <div class="border-b border-gray-300 dark:border-gray-700">
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
                <span class="mr-2">Users</span>
                <span>{props.roomData()?.users.length}</span>
              </span>
            }
          />
        </Tabs>
      </div>
      <div class="flex h-full w-full overflow-hidden">
        <Switch>
          <Match when={selectedTab() === 0}>
            <Chat messages={props.roomData()?.messages || []} />
          </Match>
          <Match when={selectedTab() === 1}>
            <Users users={props.roomData()?.users || []} />
          </Match>
        </Switch>
      </div>
    </div>
  );
};

export default SocialComponent;
