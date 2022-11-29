import type { Component } from "solid-js";
import { createSignal, Show } from "solid-js";
import { Link } from "@solidjs/router";
import useAuth from "hooks/useAuth";
import DarkToggle from "components/DarkToggle";
import ThemeSelect from "components/ThemeSelect";

const Navbar: Component = () => {
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = createSignal(false);

  return (
    <nav class="border-neutral-200 bg-neutral-800 px-2 py-2.5 dark:bg-neutral-900 sm:px-4">
      <div class="mx-auto flex flex-wrap items-center justify-between px-2">
        <Link
          href="/room"
          class="self-center whitespace-nowrap text-xl font-semibold text-white"
        >
          Hande
        </Link>
        <div class="flex items-center space-x-4 md:order-2">
          <ThemeSelect />
          <DarkToggle />
          <div class="flex items-center md:order-2">
            <button
              type="button"
              class="flex rounded-full bg-custom-primary-900 text-sm focus:ring-4 focus:ring-neutral-300 dark:focus:ring-neutral-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
              onClick={() => setMenuOpen(!menuOpen())}
            >
              <span class="sr-only">Open user menu</span>
              <div class="h-8 w-8 rounded-full">
                <div class="avatar online placeholder h-full">
                  <span class="bold text-lg text-white">
                    {auth?.user?.()?.name?.substring(0, 1) ?? ""}
                  </span>
                </div>
              </div>
            </button>
            <Show when={menuOpen()}>
              <div class="relative">
                <div
                  class="tooltip absolute right-0 top-4 z-50 my-4 w-[150px] list-none divide-y divide-neutral-200 text-base"
                  id="user-dropdown"
                >
                  <div class="py-3 px-4">
                    <span class="block text-sm text-neutral-900 dark:text-white">
                      {auth?.user()?.name}
                    </span>
                  </div>
                  <ul class="py-1" aria-labelledby="user-menu-button">
                    <li>
                      <button
                        onClick={() => auth.action.logout()}
                        class="block w-full py-2 px-4 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-custom-primary-700"
                      >
                        Kirjaudu ulos
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
