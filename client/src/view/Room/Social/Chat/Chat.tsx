import { Component, Match, Switch } from "solid-js";
import { Accessor, Setter, Show, For } from "solid-js";
import { DateTime } from "luxon";
import { IncomingMessage } from "trpc/types";
import { htmlDecode } from "utils/parse";
import Username from "view/Room/common/Username";
import { SendMessageIcon } from "components/common/icon";
import { useI18n } from "@solid-primitives/i18n";

type Props = {
  messages: IncomingMessage[];
  currentMessage: Accessor<string>;
  onChange: Setter<string>;
  onSubmit: (data: string) => void;
  ref: HTMLDivElement | undefined;
};

const RoomChat: Component<Props> = (props) => {
  const [t] = useI18n();

  return (
    <div class="flex flex-1 flex-col">
      <div class="flex h-full flex-col bg-white dark:bg-neutral-900">
        <div class="flex-1 overflow-y-scroll px-1 pb-3">
          <Show
            when={props.messages.length}
            fallback={
              <div class="flex flex-col items-center text-neutral-900 dark:text-neutral-100">
                Ei viestejä
              </div>
            }
          >
            <For each={props.messages}>
              {(message) => (
                <div class="flex space-x-2">
                  <div>
                    {DateTime.fromSeconds(message.timestamp / 1000).toFormat(
                      "HH:mm:ss"
                    )}
                  </div>
                  <div class="flex space-x-1">
                    {message.isSystem ? (
                      <Username name={message.name} isSystem />
                    ) : (
                      <Username
                        name={message.name}
                        theme={message.theme}
                        isMumbleUser={message.isMumbleUser}
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
                          {t(message.content, {
                            error: message.error ?? "",
                            item: message.item ?? "",
                          })}
                        </Match>
                        <Match when={message.error}>
                          {t(message.content, {
                            error: message.error ?? "",
                          })}
                        </Match>
                        <Match when={message.item}>
                          {t(message.content, {
                            item: message.item ?? "",
                          })}
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
