import { Component, JSX } from "solid-js";

interface Props {
  selected: boolean;
  onClick: () => void;
  text: string | JSX.Element;
}

const Tab: Component<Props> = (props) => {
  return (
    <li class="mr-2" role="presentation">
      <button
        class="inline-block rounded-t-lg border-b-2 p-4 hover:border-custom-aqua-900 hover:text-custom-aqua-900"
        classList={{
          "border-custom-aqua-900 text-custom-aqua-900": props.selected,
        }}
        id="profile-tab"
        data-tabs-target="#profile"
        type="button"
        role="tab"
        aria-controls="profile"
        aria-selected="false"
        onClick={props.onClick}
      >
        {props.text}
      </button>
    </li>
  );
};
export default Tab;
