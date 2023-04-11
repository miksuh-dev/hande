import useAuth from "hooks/useAuth";
import { createSignal } from "solid-js";
import trackClickOutside from "utils/trackClickOutside";
import UserMenu from "./UserMenu";

const UserMenuComponent = () => {
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
      <UserMenu open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default UserMenuComponent;
