import type { Component } from "solid-js";
import { Link } from "@solidjs/router";
import ThemeSelect from "components/ThemeSelect";
import UserMenu from "components/UserMenu";
import { CrownIcon } from "components/common/icon";

const Navbar: Component = () => {
  return (
    <nav class="border-neutral-200 bg-neutral-800 px-2 py-2.5 dark:bg-neutral-900 sm:px-4">
      <div class="mx-auto flex flex-wrap items-center justify-between px-2">
        <Link
          href="/room"
          class="flex self-center whitespace-nowrap text-xl font-semibold text-custom-primary-700"
        >
          <span class="mr-2 h-6 w-6">
            <CrownIcon />
          </span>
          Hande
        </Link>
        <div class="flex items-center space-x-4 md:order-2">
          <ThemeSelect />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
