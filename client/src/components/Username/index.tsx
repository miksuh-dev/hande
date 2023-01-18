import useTheme from "hooks/useTheme";
import { Component, createMemo } from "solid-js";
import { User } from "trpc/types";
import Badges from "./Badges";

type Props = {
  name: string;
  property: User["property"];
  state: User["state"];
};

const UserNameComponent: Component<Props> = (props) => {
  const theme = useTheme();

  const userTheme = createMemo(() => {
    return (
      theme.list.find((t) => t.name === props.state?.theme) ?? theme.list[0]
    )?.value[700];
  });

  return (
    <div
      class="flex items-start font-bold"
      style={{ color: userTheme() ?? "text-neutral-500" }}
    >
      <Badges property={props.property} />
      <div class="flex font-bold">{props.name}</div>
    </div>
  );
};

export default UserNameComponent;
