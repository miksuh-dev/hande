import { useI18n } from "@solid-primitives/i18n";
import { Component } from "solid-js";

const ErrorComponent: Component<{ title: string; description: string }> = (
  props
) => {
  const [t] = useI18n();

  return (
    <div class="flex h-full flex-col items-center justify-center">
      <div class="space-y-8 p-8 card">
        <div class="space-y-4">
          <div class="text-2xl text-center text-neutral-900 dark:text-neutral-200">
            {props.title}
          </div>
          <div class="text-sm text-center text-neutral-900 dark:text-neutral-200">
            {props.description}
          </div>
        </div>
        <div class="flex justify-center">
          <button class="contained" onClick={() => window.location.reload()}>
            {t("actions.refreshPage")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorComponent;
