import { Component, createSignal, Match, Switch } from "solid-js";
import Playlist from "./Playlist";
import History from "./History";
import Tabs, { Tab } from "components/Tabs";
import { useI18n } from "@solid-primitives/i18n";
import Statistics from "./Statistics";

const ListComponent: Component = () => {
  const [t] = useI18n();

  const [selectedTab, setSelectedTab] = createSignal(0);

  return (
    <div class="flex flex-1 flex-col overflow-hidden rounded-md bg-white dark:bg-neutral-900">
      <Tabs>
        <Tab
          selected={selectedTab() === 0}
          onClick={() => setSelectedTab(0)}
          text={t("playlist.title")}
        />
        <Tab
          selected={selectedTab() === 1}
          onClick={() => setSelectedTab(1)}
          text={t("history.title")}
        />
        <Tab
          selected={selectedTab() === 2}
          onClick={() => setSelectedTab(2)}
          text={t("statistics.title")}
        />
      </Tabs>
      <div class="flex h-full w-full overflow-hidden p-3 pt-1">
        <div class="flex flex-1 flex-col overflow-hidden bg-white dark:bg-neutral-900 xl:h-full">
          <Switch>
            <Match when={selectedTab() === 0}>
              <Playlist />
            </Match>
            <Match when={selectedTab() === 1}>
              <History />
            </Match>
            <Match when={selectedTab() === 2}>
              <Statistics />
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default ListComponent;
