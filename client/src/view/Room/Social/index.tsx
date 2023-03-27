import { ChatBubbleIcon } from "components/common/icon";
import { Component, createSignal, Show } from "solid-js";
import SocialComponent from "./Social";

const Social: Component = () => {
  const [open, setOpen] = createSignal(false);

  return (
    <>
      <div class="hidden flex-1 xl:block">
        <SocialComponent />
      </div>
      <div
        class="visible fixed right-0 bottom-0 z-30 flex flex-col items-end space-y-2 p-2 lg:left-auto xl:hidden"
        classList={{
          "top-0 lg:w-1/2": open(),
        }}
      >
        <Show when={open()}>
          <div class="w-full flex-1 overflow-y-hidden rounded border-2 border-neutral-500 shadow">
            <SocialComponent />
          </div>
        </Show>
        <button
          class="h-16 w-16 rounded-lg border border-custom-primary-700 bg-custom-primary-900 p-4 text-sm font-medium text-white hover:bg-custom-primary-800 focus:outline-none dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800"
          onClick={() => setOpen(!open())}
        >
          <ChatBubbleIcon />
        </button>
      </div>
    </>
  );
};

export default Social;
