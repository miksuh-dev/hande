import { Component, JSX, Show } from "solid-js";

interface Props {
  actions?: JSX.Element[] | JSX.Element;
  footer?: JSX.Element[] | JSX.Element;
  children: JSX.Element[] | JSX.Element;
}

const TabContainer: Component<Props> = (props) => {
  return (
    <div class="flex flex-1 flex-col overflow-hidden bg-white dark:bg-neutral-900 xl:h-full">
      <Show when={props.actions}>
        <div class="flex items-center space-x-2 border-b border-neutral-300 py-2 px-2 dark:border-neutral-700">
          {props.actions}
        </div>
      </Show>
      <div class="h-auto flex-1 overflow-hidden p-4 pr-0">{props.children}</div>
      <Show when={props.footer}>
        <div class="flex space-x-2 px-2">{props.footer}</div>
      </Show>
    </div>
  );
};

export default TabContainer;
