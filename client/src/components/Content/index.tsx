import { JSX } from "solid-js";
import type { Component } from "solid-js";

const Content: Component<{ children: JSX.Element }> = (props) => (
  <div class="flex h-full items-center justify-center">{props.children}</div>
);

export default Content;
