import { Component, createMemo, For } from "solid-js";
import { Show } from "solid-js";
import { htmlDecode } from "utils/parse";
import { useI18n } from "@solid-primitives/i18n";
import { SongClient } from "trpc/types";
import Tooltip from "components/Tooltip";
import SongThumbnail from "view/Room/common/SongThumbnail";
import { DateTime } from "luxon";

type Props = {
  content: string;
  item: SongClient[];
  error?: string;
};

const ChatMessageItem: Component<Props> = (props) => {
  const [t] = useI18n();

  const message = createMemo(() => {
    const messageProps = {
      count: props.item.length.toString(),
      ...(props.item[0] && { item: htmlDecode(props.item[0].title) }),
      ...(props.error && { error: props.error }),
    };

    const rawMessage: string = t(props.content, messageProps);

    const { item } = messageProps;

    if (!item || props.item.length > 1) {
      return {
        item: rawMessage,
      };
    }

    const [left, right] = rawMessage.split(`"${item}"`);

    return { left, right, item };
  });

  return (
    <span class="inline">
      <Show when={message().left}>{message().left}</Show>
      <Tooltip
        dynamic
        content={
          <For each={props.item}>
            {(item) => (
              <div class="flex flex-row items-center space-x-2 border-b-neutral-600 border-b last:border-none px-1 py-1 pb-2 last:pb-1">
                <SongThumbnail song={item} />
                <div class="flex flex-col space-y-2">
                  <div>
                    <h3 class="text-md text-left font-medium">
                      {htmlDecode(item.title ?? "")}
                    </h3>
                  </div>
                  <div class="flex flex-col text-xs font-medium items-start space-y-1">
                    <p>
                      {"originalRequester" in item
                        ? t("common.requesterWithOriginal", {
                            requester: item.requester,
                            original: item.originalRequester ?? "",
                          })
                        : `${t("common.requester")}: ${item.requester}`}
                    </p>
                    <p>
                      {DateTime.fromISO(item.createdAt, {
                        zone: "utc",
                      })
                        .setZone("local")
                        .toFormat("dd.MM.yyyy HH:mm")}
                    </p>
                    <a
                      href={"https://www.youtube.com/watch?v=" + item.contentId}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-500 hover:underline inline-block"
                    >
                      Youtube
                    </a>
                  </div>
                </div>
              </div>
            )}
          </For>
        }
      >
        <span
          class="hover:bg-neutral-200 dark:hover:bg-neutral-800"
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
