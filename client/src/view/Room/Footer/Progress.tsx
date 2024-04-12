import { DateTime } from "luxon";
import {
  Accessor,
  Component,
  createEffect,
  onCleanup,
  Setter,
  Show,
} from "solid-js";
import { PlayingSongClient, PlayState, SongType } from "trpc/types";

type Props = {
  playing: Accessor<PlayingSongClient<SongType.SONG>>;
  progress: Accessor<number>;
  setProgress: Setter<number>;
};

const ProgressComponent: Component<Props> = (props) => {
  const onTick = () => {
    const startedAt = props.playing().startedAt;

    if (!startedAt) return 0;

    const diff = DateTime.utc().diff(
      DateTime.fromISO(startedAt, {
        zone: "utc",
      }),
      "seconds"
    ).seconds;

    if (diff < 0) return 0;

    return diff;
  };

  createEffect(() => {
    props.setProgress(onTick());

    const interval = setInterval(() => {
      props.setProgress((previousProgress) => {
        const duration = props.playing().duration;

        if (previousProgress >= duration) {
          return props.playing().duration;
        }

        const currentProgress = onTick();

        if (currentProgress >= duration) {
          return props.playing().duration;
        }

        if (props.playing().state === PlayState.ENDED) {
          return previousProgress;
        }

        return currentProgress;
      });
    }, 1000);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  return (
    <div class="flex w-full flex-row items-center space-x-2">
      <div class="block h-[8px] max-h-full w-full flex-1 bg-neutral-500">
        <Show when={props.progress()}>
          <div
            class="h-full w-full bg-custom-primary-700"
            style={{
              width: `${(props.progress() / props.playing().duration) * 100}%`,
            }}
          />
        </Show>
      </div>
    </div>
  );
};

export default ProgressComponent;
