import { Component, Match, Switch } from "solid-js";
import { Accessor, Setter, Show, For } from "solid-js";
import { DateTime } from "luxon";
import { htmlDecode } from "utils/parse";
import Username from "components/Username";
import { SendMessageIcon } from "components/common/icon";
import { useI18n } from "@solid-primitives/i18n";
import { MessageOrDivider } from ".";
import ChatMessageItem from "./ChatMessageItem";

type Props = {
  messages: Accessor<MessageOrDivider[]>;
  currentMessage: Accessor<string>;
  onChange: Setter<string>;
  onSubmit: (data: string) => void;
  ref: HTMLDivElement | undefined;
};

const RoomChat: Component<Props> = (props) => {
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
    <div class="flex flex-1 flex-col">
      <div class="flex h-full flex-col bg-white dark:bg-neutral-900">
        <div class="flex-1 overflow-y-scroll px-1 pb-3 scrollbar">
          <Show
            when={props.messages().length}
            fallback={
              <div class="flex flex-col items-center text-neutral-900 dark:text-neutral-100">
                Ei viestejä
              </div>
            }
          >
            <For each={props.messages()}>
              {(message) => (
                <Show
                  when={message.type !== "divider"}
                  fallback={
                    <div class="flex flex-row items-center py-2 text-neutral-900">
                      <hr class="h-px flex-1 border-0 bg-neutral-400 dark:bg-neutral-600" />
                      <div class="flex">
                        <span class="px-2 text-sm text-neutral-700 dark:text-neutral-200">
                          {getDividerText(message.timestamp)}
                        </span>
                      </div>
                      <hr class="h-px flex-1 border-0 bg-neutral-400 dark:bg-neutral-600" />
                    </div>
                  }
                >
                  <div class="flex space-x-2">
                    <div>
                      {DateTime.fromSeconds(message.timestamp / 1000).toFormat(
                        "HH:mm:ss"
                      )}
                    </div>
                    <div class="flex space-x-1">
                      {message.property.isSystem ? (
                        <Username
                          name={message.name}
                          property={message.property}
                        />
                      ) : (
                        <Username
                          name={message.name}
                          property={message.property}
                          state={message.state}
                        />
                      )}
                      <Show when={message.type === "MESSAGE"}>:</Show>
                      <div
                        classList={{
                          italic: message.type !== "MESSAGE",
                          "normal-case": message.type === "MESSAGE",
                        }}
                      >
                        <Switch fallback={htmlDecode(message.content)}>
                          <Match when={message.error && message.item}>
                            <ChatMessageItem
                              content={message.content}
                              item={message.item}
                              error={message.error}
                            />
                          </Match>
                          <Match when={message.error}>
                            {t(message.content, {
                              error: message.error ?? "",
                            })}
                          </Match>
                          <Match when={message.item}>
                            <ChatMessageItem
                              content={message.content}
                              item={message.item}
                            />
                          </Match>
                          <Match
                            when={["ACTION", "JOIN", "LEAVE"].includes(
                              message.type
                            )}
                          >
                            {t(message.content)}
                          </Match>
                        </Switch>
                      </div>
                    </div>
                  </div>
                </Show>
              )}
            </For>
            <div ref={props.ref} />
          </Show>
        </div>
        <form class="z-10 flex" onSubmit={(e) => e.preventDefault()}>
          <input
            id="chat"
            type="text focus:outline-none"
            class="input"
            placeholder={t("chat.placeholder")}
            onChange={(e) => props.onChange(e.currentTarget.value)}
            value={props.currentMessage()}
          />
          <button
            type="submit"
            class="icon-button ml-2"
            onClick={() => props.onSubmit(props.currentMessage())}
          >
            <span class="h-6 w-6 fill-custom-primary-800">
              <SendMessageIcon />
            </span>
            <span class="sr-only">Send message</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomChat;
