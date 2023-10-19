import { Accessor, Component, Show, createMemo, createSignal } from "solid-js";
import { PlayingSong, PlayingTypeSong } from "trpc/types";
import SongImage from "../common/SongImage";
import YoutubeEmbedding from "./YoutubeEmbedding";

type Props = {
  playing: PlayingSong | undefined;
};

const VideoComponent: Component<Props> = (props) => {
  const playing = createMemo(() => props.playing);
  const [rect, setRect] = createSignal<DOMRect>();

  return (
    <div class="flex h-full items-center justify-center">
      <Show when={playing()}>
        {(song) => (
          <div
            class="h-full w-full"
            ref={(ref) => {
              const resizeObserver = new ResizeObserver((entries) => {
                setRect(entries[0]?.target.getBoundingClientRect());
              });

              resizeObserver.observe(ref);
            }}
          >
            <Show
              when={song().type === "song"}
              fallback={<SongImage song={song} />}
            >
              <YoutubeEmbedding
                rect={rect}
                song={song as Accessor<PlayingTypeSong>}
              />
            </Show>
          </div>
        )}
      </Show>
    </div>
  );
};

export default VideoComponent;
