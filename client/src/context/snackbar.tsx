import { JSX, Show, createContext, createSignal } from "solid-js";
import type { Component } from "solid-js";

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
        <div class="absolute bottom-2 flex w-full justify-center">
          <div
            id="alert-1"
            class="mb-4 flex space-x-4 rounded-lg border-2 bg-neutral-100 p-4 dark:border-neutral-500 dark:bg-neutral-900"
            role="alert"
          >
            <Show when={snackbar()?.type === "error"}>
              <div class="ml-3 flex items-center">
                <svg
                  id="exclamation-triangle-fill"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  class="h-6 w-6 text-custom-primary-900"
                >
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
              </div>
            </Show>
            <div class="ml-3 self-center text-sm font-medium text-neutral-700 dark:text-neutral-100">
              {snackbar()?.message}
            </div>
            <button
              type="button"
              class="icon-button"
              data-dismiss-target="#alert-1"
              aria-label="Close"
              onClick={() => hide()}
            >
              <svg
                aria-hidden="true"
                class="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </Show>
    </SnackbarContext.Provider>
  );
};
