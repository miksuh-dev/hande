import { useI18n } from "@solid-primitives/i18n";
import { CrownIcon, VerifiedIcon } from "components/common/icon";
import Tooltip from "components/Tooltip";
import { Show } from "solid-js";
import { User } from "trpc/types";

type Props = {
  property: User["property"];
};

const UserBadges = (props: Props) => {
  const [t] = useI18n();

  return (
    <>
      <Show when={props.property.isSystem}>
        <Tooltip text={t("badges.system")}>
          <span class="mr-1 h-4 w-4">
            <CrownIcon />
          </span>
        </Tooltip>
      </Show>
      <Show when={props.property.isMumbleUser}>
        <Tooltip text={t("badges.verified")}>
          <span class="mr-1 h-4 w-4">
            <VerifiedIcon />
          </span>
        </Tooltip>
      </Show>
    </>
  );
};

export default UserBadges;
