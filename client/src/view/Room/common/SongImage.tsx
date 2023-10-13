import { RadioIcon } from "components/common/icon";
import { Accessor, Component, createMemo, Match, Show, Switch } from "solid-js";
import { Song } from "trpc/types";

type Props = {
  song: Accessor<Song>;
  size?: "small" | "large";
};

const SongImage: Component<Props> = (props) => {
  const size = createMemo(() => props.size ?? "large");

  return (
    <div
      class="flex min-w-max max-w-xs justify-center border-2 border-neutral-300 bg-neutral-100 object-scale-down dark:border-neutral-700 dark:bg-neutral-700"
      classList={{
        "w-44": size() === "small",
        "w-72": size() === "large",
      }}
    >
      <div>
        <Switch>
          <Match when={props.song().type === "song"}>
            <Show when={props.song().thumbnail}>
              {(thumbnail) => (
                <img
                  classList={{
                    "h-24": size() === "small",
                    "h-48": size() === "large",
                  }}
                  class="flex"
                  draggable={false}
                  src={thumbnail()}
                  alt="thumbnail"
                />
              )}
            </Show>
          </Match>
          <Match when={props.song().type === "radio"}>
            <div
              class="flex self-center p-4 text-custom-primary-700"
              classList={{
                "h-24 w-24": size() === "small",
                "h-36 w-36": size() === "large",
              }}
            >
              <RadioIcon />
            </div>
          </Match>
        </Switch>
      </div>
    </div>
  );
};

export default SongImage;
