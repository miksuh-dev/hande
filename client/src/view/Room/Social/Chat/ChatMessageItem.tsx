import { Component, createMemo, For } from "solid-js";
import { Show } from "solid-js";
import { htmlDecode } from "utils/parse";
import { useI18n } from "@solid-primitives/i18n";
import { SongClient } from "trpc/types";
import Tooltip from "components/Tooltip";
import SongThumbnail from "view/Room/common/SongThumbnail";
import { DateTime } from "luxon";
import { RandomSongStatistics } from "@server/types/app";

type Props = {
  content: string;
  item?: SongClient[];
  statistics?: RandomSongStatistics;
  error?: string;
};

const ChatMessageItem: Component<Props> = (props) => {
  const [t] = useI18n();

  const message = createMemo(() => {
    const messageProps = {
      count: (props.item?.length ?? 0).toString(),
      ...(props.item?.[0] && { item: htmlDecode(props.item[0].title) }),
      ...(props.statistics && { statistics: t("event.common.randomSong") }),
      ...(props.error && { error: props.error }),
    };

    const rawMessage: string = t(props.content, messageProps);

    const { item, statistics } = messageProps;

    if (!item || (props.item?.length ?? 0) > 1) {
      return {
        item: rawMessage,
      };
    }

    const [start, end] = rawMessage.split(`"${item}"`);

    if (!statistics) {
      return { start, end, item };
    }

    const [newStart, center] = (start ?? "").split(`"${statistics}"`);

    return {
      start: newStart,
      center,
      end,
      item,
      statistics,
    };
  });

  return (
    <span class="inline">
      <Show when={message().start}>{message().start}</Show>
      <Show when={props.statistics}>
        {(stats) => (
          <Tooltip
            dynamic
            content={
              <div class="flex flex-col space-y-1 px-1 py-1 items-start">
                <span>
                  {`${t("randomStatistics.playCount")}: ${stats().playCount}`}
                </span>
                <span>
                  {`${t("randomStatistics.skipCount")}: ${stats().skipCount}`}
                </span>
                <span>
                  {`${t("randomStatistics.rating")}: ${stats().rating}`}
                </span>
                <span>
                  {`${t("randomStatistics.skipProbability")}: ${(
                    stats().skipProbability * 100
                  ).toFixed(2)}%`}
                </span>
              </div>
            }
          >
            <span
              class="hover:bg-neutral-200 dark:hover:bg-neutral-800"
              style={{ "white-space": "break-spaces" }}
            >
              {message().statistics}
            </span>
          </Tooltip>
        )}
      </Show>
      <Show when={message().center}>{message().center}</Show>
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
      <Show when={message().end}>{message().end}</Show>
    </span>
  );
};
export default ChatMessageItem;
