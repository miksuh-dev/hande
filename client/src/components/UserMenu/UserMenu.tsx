import { useI18n } from "@solid-primitives/i18n";
import ChangeLog from "components/Changelog";
import useAuth from "hooks/useAuth";
import { Accessor, Component, createSignal, Show } from "solid-js";

type Props = {
  open: Accessor<boolean>;
  onClose: () => void;
};

const UserMenu: Component<Props> = (props) => {
  const [t] = useI18n();
  const auth = useAuth();

  const [changeLogOpen, setChangeLogOpen] = createSignal(false);

  return (
    <>
      <Show when={props.open()}>
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
                  onClick={(event) => {
                    event.stopPropagation();
                    setChangeLogOpen(true);
                    props.onClose();
                  }}
                  class="block w-full py-2 px-4 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-custom-primary-700"
                >
                  {t("navigation.changelog")}
                </button>
              </li>
            </ul>
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
      <Show when={changeLogOpen()}>
        <ChangeLog onClose={() => setChangeLogOpen(false)} />
      </Show>
    </>
  );
};

export default UserMenu;
