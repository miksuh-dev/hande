import { Component, JSX } from "solid-js";
import Tab from "./Tab";
import Container from "./Container";

interface Props {
  children: JSX.Element[] | JSX.Element;
}

const Tabs: Component<Props> = (props) => {
  return (
    <div class="border-b border-neutral-300 dark:border-neutral-700">
      <ul
        class="-mb-px flex flex-wrap text-center text-sm font-medium"
        id="myTab"
        data-tabs-toggle="#myTabContent"
        role="tablist"
      >
        {props.children}
      </ul>
    </div>
  );
};

export { Tabs as default, Tab, Container as TabContainer };
