import { useI18n } from "@solid-primitives/i18n";
import { CircularLoadingSpinner } from "components/common/icon";
import { Accessor, Component, For, Show } from "solid-js";
import { PlayingSongClient, SongClient, StatisticItem } from "trpc/types";
import { htmlDecode } from "utils/parse";
import SongThumbnail from "view/Room/common/SongThumbnail";

type Props = {
  statistics: Accessor<StatisticItem[]>;
  songs: SongClient[];
  playing: PlayingSongClient | undefined;
  onAdd: (song: StatisticItem[]) => void;
  loading: Accessor<boolean>;
};

const StatisticsComponent: Component<Props> = (props) => {
  const [t] = useI18n();

  const isInQueue = (song: StatisticItem) => {
    return (
      props.songs.some((s) => s.contentId === song.contentId) ||
      (props.playing && props.playing.contentId === song.contentId)
    );
  };

  return (
    <div class="space-y h-full max-h-full space-y-2 overflow-y-auto pr-4 scrollbar">
      <Show
        when={!props.loading()}
        fallback={
          <div class="flex h-full items-center justify-center">
            <span class="h-16 w-16">
              <CircularLoadingSpinner />
            </span>
          </div>
        }
      >
        <For each={props.statistics()}>
          {(statistic, index) => (
            <div class="card flex w-full items-center justify-between space-x-2 p-2 px-4">
              <div class="flex items-center space-x-4">
                <div class="w-4 flex-shrink-0">{index() + 1}</div>
                <SongThumbnail song={statistic} />
                <div class="flex flex-col text-neutral-900 dark:text-neutral-200">
                  <h3 class="text-md text-left font-medium">
                    {htmlDecode(statistic.title ?? "")}
                  </h3>
                  <div class="space-x-4 self-start text-sm font-medium">
                    {t("statistics.playCount", {
                      count: statistic.count.toString(),
                    })}
                  </div>
                </div>
              </div>
              <button
                type="button"
                class="ml-auto inline-flex shrink-0 items-center rounded border border-transparent bg-custom-primary-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-custom-primary-800 focus:outline-none focus:ring-2 focus:ring-custom-primary-500 focus:ring-offset-2 dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800 dark:focus:ring-custom-primary-500"
                onClick={() => props.onAdd([statistic])}
                disabled={isInQueue(statistic)}
              >
                <Show
                  when={!isInQueue(statistic)}
                  fallback={t("common.inQueue")}
                >
                  {t("actions.addToQueue")}
                </Show>
              </button>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
};

export default StatisticsComponent;
