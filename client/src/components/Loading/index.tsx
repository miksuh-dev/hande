import { CircularLoadingSpinner } from "components/common/icon";
import type { Component } from "solid-js";

const Loading: Component = () => {
  return (
    <div class="flex h-full items-center justify-center">
      <span class="h-20 w-20">
        <CircularLoadingSpinner />
      </span>
      <span class="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;
