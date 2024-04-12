import { useI18n } from "@solid-primitives/i18n";
import { AudioIcon } from "components/common/icon";
import useSnackbar from "hooks/useSnackbar";
import { Component, createSignal, Show } from "solid-js";
import trpcClient from "trpc";
import { PlayingSongClient, PlayState } from "trpc/types";

type Props = {
  playing: NonNullable<PlayingSongClient>;
};

const VolumeControlComponent: Component<Props> = (props) => {
  const [t] = useI18n();
  const [audioControlOpen, setAudioControlOpen] = createSignal(false);
  const snackbar = useSnackbar();

  let timeout: ReturnType<typeof setTimeout>;

  const handleUpdateVolume = async (volume: number) => {
    try {
      await trpcClient.room.changeVolume.mutate({
        contentId: props.playing.contentId,
        volume,
      });
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(t(err.message) ?? err.message);
      }
    }
  };

  const handleMouseEnter = () => {
    if (timeout) clearTimeout(timeout);
    setAudioControlOpen(true);
  };

  const handleMouseLeave = () => {
    timeout = setTimeout(() => {
      setAudioControlOpen(false);
    }, 300);
  };

  return (
    <div
      class="relative flex justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        disabled={props.playing.state === PlayState.ENDED}
        type="button"
        class="icon-button w-12 h-12 p-1"
      >
        <AudioIcon />
      </button>
      <Show
        when={props.playing.state !== PlayState.ENDED && audioControlOpen()}
      >
        <div class="absolute top-0 z-50">
          <div class="absolute bottom-1">
            <input
              onChange={(event) => {
                const value = Number(event.currentTarget.value);
                handleUpdateVolume(value);
              }}
              type="range"
              min="0"
              max="100"
              step="10"
              value={props.playing.volume}
              class="absolute w-[150px] bottom-[75px] h-2"
              style={{
                transform: "translate(-50%, 50%) rotate(270deg)",
                "-ms-transform": "translate(-50%, 50%) rotate(270deg)",
              }}
            />
          </div>
        </div>
      </Show>
    </div>
  );
};

export default VolumeControlComponent;
