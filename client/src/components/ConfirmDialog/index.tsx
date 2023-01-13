import { CrossIcon } from "components/common/icon";
import { useI18n } from "@solid-primitives/i18n";
import { Component } from "solid-js";
import { Portal } from "solid-js/web";
import trackClickOutside from "utils/trackClickOutside";

type Props = {
  title: string;
  description: string;
  onSubmit: () => void;
  onCancel: () => void;
};

const ConfirmDialog: Component<Props> = (props) => {
  const [t] = useI18n();

  return (
    <Portal>
      <div
        class="tooltip fixed top-1/2 left-1/2 z-50 -translate-y-1/2 -translate-x-1/2 overflow-hidden"
        tabindex="-1"
        role="dialog"
        ref={(ref) => {
          trackClickOutside(ref, () => {
            props.onCancel();
          });
        }}
      >
        <div class="oveflow-y-hidden pointer-events-none relative h-full w-auto">
          <div class="pointer-events-auto relative flex h-full w-full flex-col rounded-md border-none bg-neutral-50 bg-clip-padding shadow-lg dark:bg-neutral-800">
            <div class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b border-neutral-200 p-4 dark:border-neutral-700">
              <h5 class="text-xl font-medium leading-normal ">{props.title}</h5>
              <button
                onClick={() => props.onCancel()}
                type="button"
                class="icon-button h-8 w-8 p-1"
                aria-label="Close"
              >
                <CrossIcon />
              </button>
            </div>
            <div class="flex h-full flex-col overflow-hidden p-4">
              <div class="mb-8">{props.description}</div>
              <div class="ml-auto flex space-x-4">
                <button
                  type="button"
                  class="inline-flex shrink-0 items-center rounded border border-transparent bg-custom-primary-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-custom-primary-800 focus:outline-none focus:ring-2 focus:ring-custom-primary-500 focus:ring-offset-2 dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800 dark:focus:ring-custom-primary-500"
                  onClick={() => props.onCancel()}
                >
                  {t("actions.cancel")}
                </button>
                <button
                  type="button"
                  class="inline-flex shrink-0 items-center rounded border border-transparent bg-custom-primary-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-custom-primary-800 focus:outline-none focus:ring-2 focus:ring-custom-primary-500 focus:ring-offset-2 dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800 dark:focus:ring-custom-primary-500"
                  onClick={() => props.onSubmit()}
                >
                  {t("actions.continue")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default ConfirmDialog;
