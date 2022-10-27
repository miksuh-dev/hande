import { JSX } from "solid-js";
import type { Component } from "solid-js";
import Navbar from "components/Navbar";

const Content: Component<{ children: JSX.Element }> = (props) => (
  <div class="flex h-full max-h-screen flex-col overflow-hidden">
    <Navbar />
    <div class="flex h-full max-h-screen flex-col overflow-hidden">
      {props.children}
    </div>
  </div>
);

export default Content;
