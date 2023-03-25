import { CircularLoadingSpinner } from "components/common/icon";
import { Component, Show } from "solid-js";

const Loading: Component<{ title?: string }> = (props) => {
  return (
    <div class="flex h-full  flex-col items-center  justify-center space-y-8">
      <span class="h-20 w-20">
        <CircularLoadingSpinner />
      </span>
      <Show when={props.title}>
        <div class="text-center text-neutral-200 dark:text-neutral-200">
          {props.title}
        </div>
      </Show>
      <span class="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;
