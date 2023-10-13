import { useI18n } from "@solid-primitives/i18n";
import { DateTime } from "luxon";
import { Component } from "solid-js";
import type { Divider } from "./index";

const DividerComponent: Component<{ message: Divider }> = (props) => {
  const [t] = useI18n();

  const getDividerText = (timestampSeconds: number) => {
    const now = DateTime.now().setZone("local");

    const timestamp = DateTime.fromMillis(timestampSeconds).setZone("local");
    const startOfDay = timestamp.startOf("day");

    if (now.hasSame(startOfDay, "day")) {
      return t("datetime.today");
    }

    if (now.minus({ day: 1 }).hasSame(startOfDay, "day")) {
      return t("datetime.yesterday");
    }

    return timestamp.toFormat("dd.MM.yyyy");
  };

  return (
    <div class="flex flex-row items-center py-2 text-neutral-900">
      <hr class="h-px flex-1 border-0 bg-neutral-400 dark:bg-neutral-600" />
      <div class="flex">
        <span class="px-2 text-sm text-neutral-700 dark:text-neutral-200">
          {getDividerText(props.message.timestamp)}
        </span>
      </div>
      <hr class="h-px flex-1 border-0 bg-neutral-400 dark:bg-neutral-600" />
    </div>
  );
};

export default DividerComponent;
