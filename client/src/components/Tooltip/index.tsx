import { Component, createSignal, JSX, Show } from "solid-js";
import { Portal } from "solid-js/web";

type Props = {
  children: JSX.Element;
  text: string;
};

type Position = {
  x: number;
  y: number;
};

const Tooltip: Component<Props> = (props) => {
  const [position, setPosition] = createSignal<Position | undefined>();

  return (
    <div
      class="relative mt-1 flex cursor-pointer whitespace-nowrap"
      onMouseOver={({ x, y }) => setPosition({ x, y })}
      onMouseOut={() => setPosition(undefined)}
    >
      {props.children}

      <Show when={position()} keyed>
        {(pos) => (
          <Portal>
            <div
              class="tooltip pointer-events-none absolute mt-2 p-2 text-center text-xs"
              style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
            >
              {props.text}
            </div>
          </Portal>
        )}
      </Show>
    </div>
  );
};

export default Tooltip;
