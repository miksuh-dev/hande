import useTheme from "hooks/useTheme";
import { createSignal, For, onCleanup, onMount, Show } from "solid-js";

const ThemeSelect = () => {
  const theme = useTheme();

  const [open, setOpen] = createSignal(false);
  let containerRef: HTMLDivElement | undefined = undefined;

  onMount(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        if (!containerRef?.contains(e.target)) {
          setOpen(false);
        }
      }
    };

    window.addEventListener("keydown", close);
    window.addEventListener("click", onClick);

    onCleanup(() => {
      window.removeEventListener("keydown", close);
      window.removeEventListener("click", onClick);
    });
  });

  return (
    <div class="relative" ref={containerRef}>
      <button
        type="button"
        class="flex w-9 rounded-full text-sm text-custom-primary-900"
        onClick={() => setOpen((open) => !open)}
      >
        <svg
          stroke-width="2"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.8787 7.6966L16 9.81792C16.3906 10.2084 16.3906 10.8416 16 11.2321L8.36329 18.8689C8.26994 18.9622 8.15902 19.0362 8.03694 19.0865L5.54031 20.1145C4.3074 20.6221 3.0745 19.3892 3.58216 18.1563L4.61019 15.6597C4.66046 15.5376 4.7344 15.4267 4.82776 15.3334L12.4645 7.6966C12.855 7.30607 13.4882 7.30607 13.8787 7.6966Z"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.8787 3.45395L16.0001 5.57527M20.2427 9.81791L18.1214 7.69659M16.0001 5.57527L17.4143 4.16106C17.8048 3.77054 18.438 3.77054 18.8285 4.16106L19.5356 4.86817C19.9261 5.25869 19.9261 5.89186 19.5356 6.28238L18.1214 7.69659M16.0001 5.57527L18.1214 7.69659"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <Show when={open()}>
        <div class="absolute right-0 top-8 z-50 my-4 list-none divide-y divide-neutral-100 rounded border-2 border-neutral-500 bg-white text-base shadow dark:divide-neutral-600 dark:bg-neutral-800">
          <div class="py-2 px-2">
            <div class="grid w-max grid-cols-3">
              <For each={theme.list}>
                {({ name, value }) => (
                  <button class="flex flex-col justify-self-center p-2">
                    <div
                      class="h-10 w-10"
                      style={{
                        ["background-color"]: value["500"],
                      }}
                      onMouseOver={(event) => {
                        event.currentTarget.style.backgroundColor =
                          value["900"];
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.backgroundColor =
                          value["500"];
                      }}
                      onClick={() => {
                        theme.action.setCurrent(name);
                      }}
                    />
                  </button>
                )}
              </For>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default ThemeSelect;