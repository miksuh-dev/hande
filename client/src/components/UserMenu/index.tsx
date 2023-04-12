import { useRouteData } from "@solidjs/router";
import { isLatestVersion } from "components/Changelog/utils";
import useAuth from "hooks/useAuth";
import { createMemo, createSignal, Show } from "solid-js";
import trackClickOutside from "utils/trackClickOutside";
import { RoomData } from "view/Room/data";
import UserMenu from "./UserMenu";

export enum NotifyButtons {
  changeLog = "changeLog",
}

const UserMenuComponent = () => {
  const auth = useAuth();
  const { room } = useRouteData<RoomData>();

  const [open, setOpen] = createSignal(false);

  const notifications = createMemo(() => {
    const notifyButtons: NotifyButtons[] = [];

    if (!isLatestVersion(room().version)) {
      notifyButtons.push(NotifyButtons.changeLog);
    }

    return notifyButtons;
  });

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
        class="flex rounded-full bg-custom-primary-900 text-sm"
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
          <Show when={notifications().length}>
            <svg
              class="h-6 w-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            />
            <div class="absolute -top-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-neutral-600 bg-neutral-700 text-xs font-bold text-white dark:border-neutral-900">
              !
            </div>
          </Show>
        </div>
      </button>
      <UserMenu
        open={open}
        onClose={() => setOpen(false)}
        notifications={notifications()}
      />
    </div>
  );
};

export default UserMenuComponent;
