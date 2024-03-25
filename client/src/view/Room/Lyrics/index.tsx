import { Accessor, Component } from "solid-js";
import { LyricsItem } from "trpc/types";

type Props = {
  lyrics: Accessor<LyricsItem>;
};

const LyricsComponent: Component<Props> = (props) => {
  return (
    <div class="overflow-y-auto h-full items-center justify-center scrollbar">
      <p class="whitespace-pre-line">{props.lyrics()}</p>
    </div>
  );
};

export default LyricsComponent;
