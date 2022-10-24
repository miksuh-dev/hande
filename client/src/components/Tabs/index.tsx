import { Component, JSX } from "solid-js";
import Tab from "./Tab";

interface Props {
  children: JSX.Element[] | JSX.Element;
}

const Tabs: Component<Props> = (props) => {
  return (
    <ul
      class="-mb-px flex flex-wrap text-center text-sm font-medium"
      id="myTab"
      data-tabs-toggle="#myTabContent"
      role="tablist"
    >
      {props.children}
    </ul>
  );
};

export { Tabs as default, Tab };
