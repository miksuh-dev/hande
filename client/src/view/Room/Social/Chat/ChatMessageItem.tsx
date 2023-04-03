import { Component, createMemo } from "solid-js";
import { Show } from "solid-js";
import { DateTime } from "luxon";
import { htmlDecode } from "utils/parse";
import { useI18n } from "@solid-primitives/i18n";
import { Song } from "trpc/types";
import Tooltip from "components/Tooltip";
import SongThumbnail from "view/Room/common/SongThumbnail";

type Props = {
  content: string;
  item: Song;
};

const ChatMessageItem: Component<Props> = (props) => {
  const [t] = useI18n();

  const message = createMemo(() => {
    const rawMessage: string = t(props.content, {
      item: htmlDecode(props.item.title) ?? "",
    });

    const [left, right] = rawMessage.split(`"${htmlDecode(props.item.title)}"`);

    return { left, right, original: rawMessage };
  });

  return (
    <Show when={message().left && message().right} fallback={<>{message}</>}>
      <span class="inline">
        {message().left}
        <Tooltip
          content={
            <div>
              <div class="flex flex-col space-y-2">
                <div class="flex flex-row items-center space-x-2">
                  <SongThumbnail song={props.item} />
                  <div class="flex flex-col">
                    <h3 class="text-md text-left font-medium">
                      {htmlDecode(props.item.title ?? "")}
                    </h3>
                    <div class="space-x-4 self-start text-xs font-medium">
                      <span class="text-neutral-300">
                        {t("common.requestedAt")}
                        {": "}
                        {props.item.requester}
                        {", "}
                        {DateTime.fromJSDate(props.item.createdAt, {
                          zone: "utc",
                        })
                          .setZone("local")
                          .toFormat("dd.MM.yyyy HH:mm")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <span
            class="cursor-pointer hover:bg-neutral-800"
            style={{ "white-space": "break-spaces" }}
          >
            {props.item.title}
          </span>
        </Tooltip>
        {message().right}
      </span>
    </Show>
  );
};
export default ChatMessageItem;
