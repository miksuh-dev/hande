import { JSX, Show, createContext, createSignal } from "solid-js";
import type { Component } from "solid-js";
import { CrossIcon, WarningIcon } from "components/common/icon";

interface SnackbarContextProps {
  show: (message: string, type: "success" | "error") => void;
  hide: () => void;
}

const INITIAL_VALUE = {
  show: () => {},
  hide: () => {},
};

type Snackbar = {
  message: string;
  type: "success" | "error";
};

export const SnackbarContext =
  createContext<SnackbarContextProps>(INITIAL_VALUE);

export const SnackbarProvider: Component<{
  children: JSX.Element;
}> = (props) => {
  const [snackbar, setSnackbar] = createSignal<Snackbar | null>(null);

  let timeout: number;

  const show = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });

    if (timeout) clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      setSnackbar(null);
    }, 5000);
  };

  const hide = () => {
    setSnackbar(null);

    if (timeout) clearTimeout(timeout);
  };

  return (
    <SnackbarContext.Provider value={{ show, hide }}>
      {props.children}
      <Show when={snackbar()}>
        <div class="absolute bottom-2 left-1/2 z-50 flex -translate-x-1/2 justify-center">
          <div
            id="alert-1"
            class="flex space-x-4 rounded-lg border-2 bg-neutral-100 p-4 dark:border-neutral-500 dark:bg-neutral-900"
            role="alert"
          >
            <Show when={snackbar()?.type === "error"}>
              <span class="ml-3 flex h-full w-6 items-center text-custom-primary-900">
                <WarningIcon />
              </span>
            </Show>
            <div class="ml-3 self-center text-sm font-medium text-neutral-700 dark:text-neutral-100">
              {snackbar()?.message}
            </div>
            <div class="flex items-center">
              <button
                type="button"
                class="icon-button h-10 w-10"
                data-dismiss-target="#alert-1"
                aria-label="Close"
                onClick={() => hide()}
              >
                <CrossIcon />
              </button>
            </div>
          </div>
        </div>
      </Show>
    </SnackbarContext.Provider>
  );
};
