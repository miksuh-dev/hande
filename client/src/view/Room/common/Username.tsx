import Tooltip from "components/ToolTip";
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
      class="flex font-bold "
      style={{ color: userTheme() ?? "text-neutral-500" }}
    >
      <Show when={props.isSystem}>
        <Tooltip text="Hallitkoon kuningas omaa huonettaan ennen kuin muihin puuttuu">
          <svg
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 220 220"
            fill="currentColor"
            class="mr-1 h-4 w-4 self-center"
          >
            <path d="M220,98.865c0-12.728-10.355-23.083-23.083-23.083s-23.083,10.355-23.083,23.083c0,5.79,2.148,11.084,5.681,15.14  l-23.862,21.89L125.22,73.002l17.787-20.892l-32.882-38.623L77.244,52.111l16.995,19.962l-30.216,63.464l-23.527-21.544  c3.528-4.055,5.671-9.344,5.671-15.128c0-12.728-10.355-23.083-23.083-23.083C10.355,75.782,0,86.137,0,98.865  c0,11.794,8.895,21.545,20.328,22.913l7.073,84.735H192.6l7.073-84.735C211.105,120.41,220,110.659,220,98.865z" />
          </svg>
        </Tooltip>
      </Show>
      <Show when={props.isMumbleUser}>
        <Tooltip text="Tämä käyttäjä on kirjautunut käyttäen Mumble-tunnusta">
          <svg
            version="1.1"
            viewBox="0,0,24,24"
            xmlns="http://www.w3.org/2000/svg"
            class="mr-1 h-4 w-4 self-center"
            fill="currentColor"
          >
            <path
              d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"
              fill="currentColor"
            />
          </svg>
        </Tooltip>
      </Show>
      <div class="flex font-bold">{props.name}</div>
    </div>
  );
};

export default UserNameComponent;
