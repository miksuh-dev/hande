import { NotifyCircle } from "components/common/icon";
import { Component, JSX, Show } from "solid-js";

type Props = {
  children: JSX.Element;
  onClick?: () => void;
  notify?: boolean;
};

const MenuItem: Component<Props> = (props) => {
  return (
    <Show
      when={props.onClick}
      fallback={
        <div class="block w-full py-3 px-4 text-left text-sm text-neutral-700 dark:text-neutral-200">
          {props.children}
        </div>
      }
    >
      <button
        onClick={(event) => {
          event.stopPropagation();
          props.onClick();
        }}
        class="flex w-full items-center justify-between py-3 px-4 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-custom-primary-700"
      >
        <span>{props.children}</span>
        <Show when={props.notify}>
          <span class="inline-block h-4 w-4 text-custom-primary-700">
            <NotifyCircle />
          </span>
        </Show>
      </button>
    </Show>
  );
};

export default MenuItem;
