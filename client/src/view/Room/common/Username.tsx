import { CrownIcon, VerifiedIcon } from "components/common/icon";
import Tooltip from "components/Tooltip";
import useTheme from "hooks/useTheme";
import { Component, createMemo, Show } from "solid-js";

type Props = {
  name: string;
  theme?: string;
  isSystem?: boolean;
  isMumbleUser?: boolean;
};

const UserNameComponent: Component<Props> = (props) => {
  const theme = useTheme();

  const userTheme = createMemo(() => {
    return (theme.list.find((t) => t.name === props.theme) ?? theme.list[0])
      ?.value[700];
  });

  return (
    <div
      class="flex items-start font-bold"
      style={{ color: userTheme() ?? "text-neutral-500" }}
    >
      <Show when={props.isSystem}>
        <Tooltip text="Hallitkoon kuningas omaa huonettaan ennen kuin muihin puuttuu">
          <span class="mr-1 h-4 w-4">
            <CrownIcon />
          </span>
        </Tooltip>
      </Show>
      <Show when={props.isMumbleUser}>
        <Tooltip text="Tämä käyttäjä on kirjautunut käyttäen Mumble-tunnusta">
          <span class="mr-1 h-4 w-4">
            <VerifiedIcon />
          </span>
        </Tooltip>
      </Show>
      <div class="flex font-bold">{props.name}</div>
    </div>
  );
};

export default UserNameComponent;
