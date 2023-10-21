import { useRouteData } from "@solidjs/router";
import { ChatBubbleIcon } from "components/common/icon";
import { Accessor, Component, Setter, Show } from "solid-js";
import type { RoomData } from "view/Room/data";
import SocialComponent from "./Social";

type Props = {
  showSocial: Accessor<boolean>;
  setShowSocial: Setter<boolean>;
};

const Social: Component<Props> = (props) => {
  const { room } = useRouteData<RoomData>();

  return (
    <>
      <div class="hidden flex-1 xl:block">
        <SocialComponent />
      </div>
      <div
        class="visible absolute left-2 right-2 bottom-2 z-30 flex flex-col items-end space-y-2 lg:left-auto xl:hidden"
        classList={{
          "top-2 lg:w-1/2": props.showSocial(),
        }}
      >
        <Show when={props.showSocial()}>
          <div class="w-full flex-1 overflow-y-hidden rounded">
            <div class="border-2 border-neutral-500 rounded h-full">
              <SocialComponent />
            </div>
          </div>
        </Show>
        <Show when={!room().playing}>
          <button
            class="xl:hidden z-40 rounded-lg border border-custom-primary-700 p-2 text-sm font-medium text-white hover:bg-custom-primary-800 focus:outline-none dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800"
            onClick={() => props.setShowSocial(!props.showSocial())}
          >
            <ChatBubbleIcon />
          </button>
        </Show>
      </div>
    </>
  );
};

export default Social;
