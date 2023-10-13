import { Component, createSignal, JSX, Match, Show, Switch } from "solid-js";
import { Portal } from "solid-js/web";
import trackClickOutside from "utils/trackClickOutside";
import trackMoveOutside from "utils/trackMoveOutside";

type Props = {
  children: JSX.Element;
  text?: string;
  content?: JSX.Element;
  visible?: boolean;
  dynamic?: boolean;
  destroyOnClick?: boolean;
};

type Position = {
  x: number;
  y: number;
};

enum Anchor {
  TOP = "top",
  BOTTOM = "bottom",
}

const SPACING = 16;

const Tooltip: Component<Props> = (props) => {
  const [position, setPosition] = createSignal<Position | undefined>();
  const [visible, setVisible] = createSignal<boolean>(false);
  const [toggle, setToggle] = createSignal<boolean>(false);
  const [anchor, setAnchor] = createSignal<Anchor>(Anchor.BOTTOM);
  const [destroyed, setDestroyed] = createSignal(false);

  let tooltipRef: HTMLDivElement;

  const handleMouseMove = (event: MouseEvent) => {
    if (!tooltipRef) return;

    let { x, y } = event;
    const { width, height } = tooltipRef.getBoundingClientRect();

    if (x - width / 2 <= 0) {
      x = width / 2;
    }

    if (x + width / 2 > window.innerWidth) {
      x = window.innerWidth - width / 2;
    }

    const anchor =
      y + height + SPACING > window.innerHeight ? Anchor.TOP : Anchor.BOTTOM;
    const anchorSpacing = anchor === Anchor.TOP ? -SPACING : SPACING;

    y = y - height / 2 + anchorSpacing;

    setAnchor(anchor);

    setPosition({
      x,
      y,
    });
  };

  return (
    <span
      classList={{
        "cursor-default": !props.dynamic,
        "cursor-pointer": props.dynamic,
      }}
      onClick={(event) => {
        if (props.dynamic) {
          event.stopPropagation();
          setToggle(!toggle());
        } else if (props.destroyOnClick) {
          setDestroyed(true);
          setVisible(false);
          setPosition(undefined);
        }
      }}
      onMouseEnter={() => {
        setVisible(true);
        setDestroyed(false);
      }}
      onMouseOver={() => setVisible(true)}
      onMouseLeave={() => {
        if (!toggle()) {
          setVisible(false);
          setPosition(undefined);
        }
      }}
      onMouseMove={(event) => {
        if (!toggle()) {
          handleMouseMove(event);
        }
      }}
    >
      {props.children}
      <Show when={visible() && (props.visible ?? true) && !destroyed()}>
        <Portal>
          <div
            class="tooltip pointer-events-none absolute z-50 w-max -translate-x-1/2 p-2 text-center text-xs"
            style={{
              left: `${position()?.x}px`,
              top: `${position()?.y}px`,
              right: "auto",
              bottom: "auto",
            }}
            classList={{
              "pointer-events-auto": props.dynamic,
              "pointer-events-none": !props.dynamic,
              "-translate-y-1/2": anchor() === Anchor.TOP,
              "translate-y-1/2": anchor() === Anchor.BOTTOM,
            }}
            ref={(el) => {
              tooltipRef = el;
            }}
          >
            <Switch>
              <Match when={props.content}>
                {(content) => (
                  <div
                    class="flex max-h-[500px] max-w-xl flex-col overflow-hidden"
                    ref={(ref) => {
                      if (props.dynamic) {
                        trackClickOutside(ref, () => {
                          setVisible(false);
                          setPosition(undefined);
                          setToggle(false);
                        });
                      }
                    }}
                  >
                    <div
                      class="h-full space-y-3 overflow-y-auto"
                      ref={(tooltipRef) =>
                        trackMoveOutside(tooltipRef, () => {
                          setVisible(false);
                          setToggle(false);
                        })
                      }
                    >
                      {content()}
                    </div>
                  </div>
                )}
              </Match>
              <Match when={props.text}>{(text) => text()}</Match>
            </Switch>
          </div>
        </Portal>
      </Show>
    </span>
  );
};

export default Tooltip;
