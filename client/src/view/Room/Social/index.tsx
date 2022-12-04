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
        class="m-full visible fixed right-2 bottom-2 z-30 flex flex-col items-end space-y-2 xl:hidden"
        classList={{
          "top-0 w-1/2": open(),
        }}
      >
        <Show when={open()}>
          <div class="w-full flex-1 overflow-y-hidden rounded border-2 border-neutral-500 shadow">
            <SocialComponent />
          </div>
        </Show>
        <button
          class="h-16 w-16 rounded-lg border border-custom-primary-700 bg-custom-primary-900 p-4 text-sm font-medium text-white hover:bg-custom-primary-800 focus:outline-none dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open());
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="bi bi-chat"
            viewBox="0 0 16 16"
            stroke="currentColor"
            stroke-width="0.5"
          >
            <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />{" "}
          </svg>
        </button>
      </div>
    </>
  );
};

export default Social;
