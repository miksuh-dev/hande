import { useI18n } from "@solid-primitives/i18n";
import { CrownIcon, VerifiedIcon } from "components/common/icon";
import Tooltip from "components/Tooltip";
import { Show } from "solid-js";
import { IncomingMessage } from "trpc/types";
import { isMumbleUser, isSystemMessage } from "../../utils/user";

type Props = {
  property: IncomingMessage["property"];
};

const UserBadges = (props: Props) => {
  const [t] = useI18n();

  return (
    <>
      <Show when={isSystemMessage({ property: props.property })}>
        <Tooltip text={t("badges.system")}>
          <span class="my-1 mr-1 block h-4 w-4">
            <CrownIcon />
          </span>
        </Tooltip>
      </Show>
      <Show when={isMumbleUser({ property: props.property })}>
        <Tooltip text={t("badges.verified")}>
          <span class="my-1 mr-1 block h-4 w-4">
            <VerifiedIcon />
          </span>
        </Tooltip>
      </Show>
    </>
  );
};

export default UserBadges;
