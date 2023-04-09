import { Component, createMemo, For } from "solid-js";
import { Show } from "solid-js";
import { DateTime } from "luxon";
import { htmlDecode } from "utils/parse";
import { useI18n } from "@solid-primitives/i18n";
import { Song } from "trpc/types";
import Tooltip from "components/Tooltip";
import SongThumbnail from "view/Room/common/SongThumbnail";

type Props = {
  content: string;
  item: Song[];
  error?: string;
};

const ChatMessageItem: Component<Props> = (props) => {
  const [t] = useI18n();

  const message = createMemo(() => {
    const firstItem = props.item[0];
    const rawMessage: string = t(props.content, {
      item: firstItem?.title ?? "",
      error: props.error ?? "",
      count: props.item.length.toString(),
    });

    if (!firstItem || props.item.length > 1) {
      return {
        item: rawMessage,
      };
    }

    const item = htmlDecode(firstItem.title);

    const [left, right] = rawMessage.split(`"${item}"`);

    return { left, right, item };
  });

  return (
    <span class="inline">
      <Show when={message().left}>{message().left}</Show>
      <Tooltip
        dynamic={props.item.length > 1}
        content={
          <For each={props.item}>
            {(item) => (
              <div class="flex flex-row items-center space-x-2">
                <SongThumbnail song={item} />
                <div class="flex flex-col">
                  <h3 class="text-md text-left font-medium">
                    {htmlDecode(item.title ?? "")}
                  </h3>
                  <div class="space-x-4 self-start text-xs font-medium">
                    <span class="text-neutral-300">
                      {t("common.requestedAt")}
                      {": "}
                      {item.requester}
                      {", "}
                      {DateTime.fromJSDate(item.createdAt, {
                        zone: "utc",
                      })
                        .setZone("local")
                        .toFormat("dd.MM.yyyy HH:mm")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </For>
        }
      >
        <span
          class="hover:bg-neutral-800"
          style={{ "white-space": "break-spaces" }}
        >
          {message().item}
        </span>
      </Tooltip>
      <Show when={message().right}>{message().right}</Show>
    </span>
  );
};
export default ChatMessageItem;
