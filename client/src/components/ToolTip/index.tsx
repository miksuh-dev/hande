import { Component, JSX } from "solid-js";

type Props = {
  children: JSX.Element;
  text: string;
};

const Tooltip: Component<Props> = (props) => {
  return (
    <div class="group relative flex cursor-pointer self-center whitespace-nowrap">
      {props.children}
      <div class="pointer-events-none absolute top-full -left-1/2 z-50 mt-2 rounded border border-neutral-500 bg-white p-2 text-center text-xs opacity-0 shadow group-hover:opacity-100 dark:bg-neutral-800">
        {props.text}
      </div>
    </div>
  );
};

export default Tooltip;
