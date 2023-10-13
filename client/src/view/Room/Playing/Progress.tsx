import { DateTime } from "luxon";
import {
  Accessor,
  Component,
  createEffect,
  createSignal,
  onCleanup,
} from "solid-js";
import { PlayingTypeSong } from "trpc/types";
import { secondsToTime } from "./utils";

type Props = {
  playing: Accessor<NonNullable<PlayingTypeSong>>;
};

const ProgressComponent: Component<Props> = (props) => {
  const getProgressStatus = () => {
    const startedAt = props.playing().startedAt;

    if (!startedAt) return 0;

    const diff = DateTime.utc().diff(
      DateTime.fromISO(startedAt, {
        zone: "utc",
      }),
      "seconds",
    ).seconds;

    if (diff < 0) return 0;

    return diff;
  };

  const [progress, setProgress] = createSignal<number>(getProgressStatus());

  createEffect(() => {
    setProgress(getProgressStatus());

    const interval = setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= props.playing().duration) {
          return props.playing().duration;
        }

        return getProgressStatus();
      });
    }, 1000);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  return (
    <div class="flex w-full flex-row items-center space-x-2">
      <div>{secondsToTime(progress())}</div>
      <div class="block h-[6px] max-h-full w-full  flex-1 bg-neutral-500">
        <div
          class="h-full w-full bg-custom-primary-700"
          style={{ width: `${(progress() / props.playing().duration) * 100}%` }}
        />
      </div>
      <div>{secondsToTime(props.playing().duration)}</div>
    </div>
  );
};

export default ProgressComponent;
