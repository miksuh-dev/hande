import { CrossIcon } from "components/common/icon";
import { Component, JSX } from "solid-js";
import { Portal } from "solid-js/web";
import trackClickOutside from "utils/trackClickOutside";

type Props = {
  title: string;
  children: JSX.Element;
  actions?: JSX.Element;
  onClose: () => void;
};

const PlaylistView: Component<Props> = (props) => {
  return (
    <Portal>
      <div
        class="tooltip fixed top-1/2 left-1/2 z-50 h-full w-full -translate-y-1/2 -translate-x-1/2 overflow-hidden outline-none md:h-3/4 md:w-3/4 2xl:w-1/2"
        tabindex="-1"
        role="dialog"
        ref={(ref) => {
          trackClickOutside(ref, () => {
            props.onClose();
          });
        }}
      >
        <div class="oveflow-y-hidden pointer-events-none relative h-full w-auto">
          <div class="pointer-events-auto relative flex h-full w-full flex-col rounded-md border-none bg-neutral-50 bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-900">
            <div class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b border-neutral-200 p-4 dark:border-neutral-700">
              <h5 class="text-xl font-medium leading-normal">{props.title}</h5>
              <button
                onClick={() => props.onClose()}
                type="button"
                class="icon-button h-8 w-8 p-1"
                aria-label="Close"
              >
                <CrossIcon />
              </button>
            </div>
            <div class="flex h-full flex-col space-y-4 overflow-hidden p-4 pr-2">
              <div class="relative h-full space-y-2 overflow-y-scroll scrollbar pr-4">
                {props.children}
              </div>
              {props.actions}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default PlaylistView;
