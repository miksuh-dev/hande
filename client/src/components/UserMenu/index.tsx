import { useI18n } from "@solid-primitives/i18n";
import useAuth from "hooks/useAuth";
import { createSignal, Show } from "solid-js";
import trackClickOutside from "utils/trackClickOutside";

const UserMenu = () => {
  const [t] = useI18n();
  const auth = useAuth();

  const [open, setOpen] = createSignal(false);

  return (
    <div
      class="relative"
      ref={(ref) => {
        trackClickOutside(ref, (open) => {
          setOpen(open);
        });
      }}
    >
      <button
        type="button"
        class="flex rounded-full bg-custom-primary-900 text-sm focus:ring-4 focus:ring-neutral-300 dark:focus:ring-neutral-600"
        id="user-menu-button"
        aria-expanded="false"
        data-dropdown-toggle="user-dropdown"
        data-dropdown-placement="bottom"
        onClick={() => setOpen(!open())}
      >
        <span class="sr-only">Open user menu</span>
        <div class="h-9 w-9 rounded-full">
          <div class="avatar online placeholder flex justify-center">
            <div class="bold text-2xl text-white">
              {auth?.user?.()?.name?.substring(0, 1) ?? ""}
            </div>
          </div>
        </div>
      </button>
      <Show when={open()}>
        <div class="relative">
          <div class="tooltip absolute right-0 top-0 z-50 my-4 w-[150px] list-none divide-y divide-neutral-200 text-base">
            <div class="py-3 px-4">
              <span class="block text-sm text-neutral-900 dark:text-white">
                {auth?.user()?.name}
              </span>
            </div>
            <ul class="py-1">
              <li>
                <button
                  onClick={() => auth.action.logout()}
                  class="block w-full py-2 px-4 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-custom-primary-700"
                >
                  {t("navigation.user.logout")}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default UserMenu;
