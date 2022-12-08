import { Component, createSignal, JSX, Show } from "solid-js";
import { Portal } from "solid-js/web";

type Props = {
  children: JSX.Element;
  text: string;
  visible?: boolean;
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
      onClick={() => setPosition(undefined)}
    >
      {props.children}
      <Show when={props.visible ?? true}>
        <Show when={position()} keyed>
          {(pos) => (
            <Portal>
              <div
                class="tooltip pointer-events-none absolute z-50 mt-5 -translate-x-1/2 p-2 text-center text-xs"
                style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
              >
                {props.text}
              </div>
            </Portal>
          )}
        </Show>
      </Show>
    </div>
  );
};

export default Tooltip;
