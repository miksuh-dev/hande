import { Component, createSignal, JSX, Match, Show, Switch } from "solid-js";
import { Portal } from "solid-js/web";

type Props = {
  children: JSX.Element;
  text?: string;
  content?: JSX.Element;
  visible?: boolean;
};

type Position = {
  x: number;
  y: number;
};

enum Anchor {
  TOP = "top",
  BOTTOM = "bottom",
  LEFT = "left",
  RIGHT = "right",
}

const SPACING = 16;

const Tooltip: Component<Props> = (props) => {
  const [position, setPosition] = createSignal<Position | undefined>();
  const [show, setShow] = createSignal<boolean>(false);
  const [anchor, setAnchor] = createSignal<Anchor[]>([Anchor.BOTTOM]);

  let tooltipRef: HTMLDivElement;

  const getAnchors = (x: number, y: number, width: number, height: number) => {
    const anchors: Anchor[] = [];

    if (x + width / 2 >= window.innerWidth) {
      anchors.push(Anchor.LEFT);
    }

    if (x - width / 2 <= 0) {
      anchors.push(Anchor.RIGHT);
    }

    if (y + height + SPACING >= window.innerHeight) {
      anchors.push(Anchor.TOP);
    } else {
      anchors.push(Anchor.BOTTOM);
    }

    return anchors;
  };

  const handleMouseMove = (event: MouseEvent) => {
    const { x, y } = event;
    if (!tooltipRef) return;

    const { width, height } = tooltipRef.getBoundingClientRect();
    const anchors = getAnchors(x, y, width, height);

    const ySpacing = anchors.includes(Anchor.BOTTOM) ? SPACING : -SPACING;

    setAnchor(anchors);
    setPosition({
      x: x - width / 2,
      y: y - height / 2 + ySpacing,
    });
  };

  return (
    <span
      class="cursor-pointer"
      onMouseOver={() => setShow(true)}
      onMouseLeave={() => {
        setShow(false);
        setPosition(undefined);
      }}
      onMouseMove={handleMouseMove}
    >
      {props.children}
      <Show when={show() && (props.visible ?? true)}>
        <Portal>
          <div
            class="tooltip pointer-events-none absolute z-50 w-max p-2 text-center text-xs"
            style={{
              left: `${position()?.x}px`,
              top: `${position()?.y}px`,
              right: "auto",
              bottom: "auto",
            }}
            classList={{
              "-translate-y-1/2": anchor().includes(Anchor.TOP),
              "translate-y-1/2": anchor().includes(Anchor.BOTTOM),
              "-translate-x-1/2": anchor().includes(Anchor.LEFT),
              "translate-x-1/2": anchor().includes(Anchor.RIGHT),
            }}
            ref={(el) => {
              tooltipRef = el;
            }}
          >
            <Switch>
              <Match when={props.content}>{props.content}</Match>
              <Match when={props.text}>{props.text}</Match>
            </Switch>
          </div>
        </Portal>
      </Show>
    </span>
  );
};

export default Tooltip;
