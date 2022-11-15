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

  const show = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
  };

  const hide = () => {
    setSnackbar(null);
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
            <div class="ml-3 text-sm font-medium text-neutral-700 dark:text-neutral-100">
              {snackbar()?.message}
            </div>
            <button
              type="button"
              class="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-neutral-100 p-1.5 text-neutral-500 hover:bg-neutral-200 focus:ring-2 focus:ring-neutral-400 dark:bg-transparent dark:text-neutral-100 dark:hover:text-red-600"
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
