import type { Component } from "solid-js";
import { createSignal, Show } from "solid-js";
import { Link } from "@solidjs/router";
import useAuth from "hooks/useAuth";

const Navbar: Component = () => {
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = createSignal(false);

  return (
    <nav class=" rounded border-gray-200 bg-neutral-800 px-2 py-2.5 dark:bg-gray-900 sm:px-4">
      <div class="mx-auto flex flex-wrap items-center justify-between px-2">
        <Link
          href="/"
          class="self-center whitespace-nowrap text-xl font-semibold text-white"
        >
          Hande
        </Link>
        <div class="flex items-center md:order-2">
          <button
            type="button"
            class="mr-3 flex rounded-full bg-custom-aqua-900 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 md:mr-0"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="user-dropdown"
            data-dropdown-placement="bottom"
            onClick={() => setMenuOpen(!menuOpen())}
          >
            <span class="sr-only">Open user menu</span>
            <div class="h-8 w-8 rounded-full">
              <div class="avatar online placeholder">
                <span class="bold text-lg text-white">
                  {auth.user()?.name.substring(0, 1) ?? ""}
                </span>
              </div>
            </div>
          </button>
          <Show when={menuOpen()}>
            <div class="relative">
              <div
                class="absolute right-0 top-4 z-50 my-4 w-[150px] list-none divide-y divide-gray-100 rounded bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700"
                id="user-dropdown"
              >
                <div class="py-3 px-4">
                  <span class="block text-sm text-gray-900 dark:text-white">
                    {auth.user()?.name}
                  </span>
                </div>
                <ul class="py-1" aria-labelledby="user-menu-button">
                  <li>
                    <button
                      onClick={() => auth.action.logout()}
                      class="block w-full py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
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
    </nav>
  );
};

export default Navbar;
