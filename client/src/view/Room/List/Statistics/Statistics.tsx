import { useI18n } from "@solid-primitives/i18n";
import { CircularLoadingSpinner, RadioIcon } from "components/common/icon";
import { Accessor, Component, For, Match, Show, Switch } from "solid-js";
import { Statistic } from "trpc/types";
import { htmlDecode } from "utils/parse";

type Props = {
  statistics: Accessor<Statistic[]>;
  loading: Accessor<boolean>;
};

const StatisticsComponent: Component<Props> = (props) => {
  const [t] = useI18n();

  return (
    <div class="space-y h-full max-h-full space-y-2 overflow-y-auto pr-4">
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
            <div class="card flex w-full items-center justify-between p-2 px-4">
              <div class="flex items-center space-x-4">
                <div class="w-4 flex-shrink-0">{index() + 1}</div>
                <Switch>
                  <Match when={statistic.thumbnail}>
                    <img
                      class="border-1 h-10 w-10 rounded-full"
                      src={statistic.thumbnail}
                      alt=""
                    />
                  </Match>
                  <Match when={statistic.type === "radio"}>
                    <div class="border-1 flex h-10 w-12 items-center justify-center rounded-full bg-neutral-100 text-custom-primary-700 dark:bg-neutral-700">
                      <div class="flex h-6 w-6 justify-center">
                        <RadioIcon />
                      </div>
                    </div>
                  </Match>
                </Switch>
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
            </div>
          )}
        </For>
      </Show>
    </div>
  );
};

export default StatisticsComponent;
