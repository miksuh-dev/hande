import { JSX, Show } from "solid-js";
import type { Component } from "solid-js";
import Navbar from "components/Navbar";

const Content: Component<{ children: JSX.Element; footer?: JSX.Element }> = (
  props,
) => (
  <div class="flex h-full max-h-screen flex-col overflow-hidden">
    <Navbar />
    <div
      id="main-content"
      class="relative flex h-full max-h-screen flex-col overflow-hidden"
    >
      {props.children}
    </div>
    <Show when={props.footer}>{(footer) => <>{footer}</>}</Show>
  </div>
);

export default Content;
