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
          class="flex self-center whitespace-nowrap text-xl font-semibold text-custom-primary-700"
        >
          <svg
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 220 220"
            fill="currentColor"
            class="mr-2 h-6 w-6"
          >
            <path d="M220,98.865c0-12.728-10.355-23.083-23.083-23.083s-23.083,10.355-23.083,23.083c0,5.79,2.148,11.084,5.681,15.14  l-23.862,21.89L125.22,73.002l17.787-20.892l-32.882-38.623L77.244,52.111l16.995,19.962l-30.216,63.464l-23.527-21.544  c3.528-4.055,5.671-9.344,5.671-15.128c0-12.728-10.355-23.083-23.083-23.083C10.355,75.782,0,86.137,0,98.865  c0,11.794,8.895,21.545,20.328,22.913l7.073,84.735H192.6l7.073-84.735C211.105,120.41,220,110.659,220,98.865z" />
          </svg>
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
