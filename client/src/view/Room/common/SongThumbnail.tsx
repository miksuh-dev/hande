import { RadioIcon } from "components/common/icon";
import Tooltip from "components/Tooltip";
import { Component, Match, Switch } from "solid-js";
import { Source } from "trpc/types";

type Props = {
  song: {
    thumbnail: string | null;
    title: string;
    type: Source["value"];
  };
};

const SongThumbnail: Component<Props> = (props) => {
  return (
    <Switch>
      <Match when={props.song.thumbnail}>
        <Tooltip
          content={
            <div>
              <img
                class="h-48 w-48"
                src={props.song.thumbnail ?? ""}
                alt={`${props.song.title} thumbnail`}
              />
            </div>
          }
        >
          <img
            class="border-1 h-10 w-10 rounded-full"
            src={props.song.thumbnail ?? ""}
            alt=""
          />
        </Tooltip>
      </Match>
      <Match when={props.song.type === "radio"}>
        <div class="border-1 flex h-10 w-12  items-center justify-center rounded-full bg-neutral-100 text-custom-primary-700 dark:bg-neutral-700">
          <div class="flex h-4 w-4 justify-center">
            <RadioIcon />
          </div>
        </div>
      </Match>
    </Switch>
  );
};

export default SongThumbnail;
