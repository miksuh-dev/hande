import { useI18n } from "@solid-primitives/i18n";
import ChangeLog from "components/Changelog";
import useAuth from "hooks/useAuth";
import { Accessor, Component, createSignal, Show } from "solid-js";
import { NotifyButtons } from ".";
import MenuItem from "./MenuItem";

type Props = {
  open: Accessor<boolean>;
  onClose: () => void;
  notifications: NotifyButtons[];
};

const UserMenu: Component<Props> = (props) => {
  const [t] = useI18n();
  const auth = useAuth();

  const [changeLogOpen, setChangeLogOpen] = createSignal(false);

  return (
    <>
      <Show when={props.open()}>
        <div class="relative">
          <div class="tooltip absolute right-0 top-0 z-50 my-4 w-[175px] list-none divide-y divide-neutral-200 text-base">
            <MenuItem>{auth?.user()?.name}</MenuItem>
            <MenuItem
              onClick={() => {
                setChangeLogOpen(true);
                props.onClose();
              }}
              notify={props.notifications.includes(NotifyButtons.changeLog)}
            >
              {t("navigation.changelog")}
            </MenuItem>
            <MenuItem onClick={() => auth.action.logout()}>
              {t("navigation.user.logout")}
            </MenuItem>
          </div>
        </div>
      </Show>
      <Show when={changeLogOpen()}>
        <ChangeLog onClose={() => setChangeLogOpen(false)} />
      </Show>
    </>
  );
};

export default UserMenu;
