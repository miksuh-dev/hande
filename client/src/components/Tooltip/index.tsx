import { Component, JSX } from "solid-js";

type Props = {
  children: JSX.Element;
  text: string;
};

const Tooltip: Component<Props> = (props) => {
  return (
    <div class="group relative mt-1 flex cursor-pointer whitespace-nowrap">
      {props.children}
      <div class="tooltip pointer-events-none absolute top-full -left-1/2 z-50 mt-2 p-2 text-center text-xs opacity-0 group-hover:opacity-100">
        {props.text}
      </div>
    </div>
  );
};

export default Tooltip;
