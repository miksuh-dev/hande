import { RadioIcon } from "components/common/icon";
import { Component, Match, Show, Switch } from "solid-js";
import { Song } from "trpc/types";

type Props = {
  song: Song;
};

const SongImage: Component<Props> = (props) => {
  return (
    <div class="flex h-48 min-w-max max-w-xs justify-center border-2 border-neutral-300 bg-neutral-100 object-scale-down dark:border-neutral-700 dark:bg-neutral-700">
      <Switch>
        <Match when={props.song.type === "song"}>
          <Show when={props.song.thumbnail}>
            {(thumbnail) => <img src={thumbnail} alt="thumbnail" />}
          </Show>
        </Match>
        <Match when={props.song.type === "radio"}>
          <div class="flex h-24 w-24 self-center text-custom-primary-700">
            <RadioIcon />
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default SongImage;
