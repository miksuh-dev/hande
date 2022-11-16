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
        class="inline-block rounded-t-lg border-b-2 p-4 font-bold hover:border-custom-primary-900 hover:text-custom-primary-900"
        classList={{
          "border-custom-primary-900 text-custom-primary-900": props.selected,
          "border-neutral-300 dark:border-neutral-700": !props.selected,
        }}
        id="profile-tab"
        data-tabs-target="#profile"
        type="button"
        role="tab"
        aria-controls="profile"
        aria-selected="false"
        onClick={() => props.onClick()}
      >
        {props.text}
      </button>
    </li>
  );
};
export default Tab;
