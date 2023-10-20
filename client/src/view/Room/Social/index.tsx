import { Accessor, Component, Show } from "solid-js";
import SocialComponent from "./Social";

type Props = {
  open: Accessor<boolean>;
};

const Social: Component<Props> = (props) => {
  return (
    <>
      <div class="hidden flex-1 xl:block">
        <SocialComponent />
      </div>
      <div
        class="visible absolute right-0 bottom-0 z-30 flex flex-col items-end space-y-2 p-2 lg:left-auto xl:hidden"
        classList={{
          "top-0 w-screen lg:w-1/2": props.open(),
        }}
      >
        <Show when={props.open()}>
          <div class="w-full flex-1 overflow-y-hidden rounded border-2 border-neutral-500 shadow">
            <SocialComponent />
          </div>
        </Show>
      </div>
    </>
  );
};

export default Social;
