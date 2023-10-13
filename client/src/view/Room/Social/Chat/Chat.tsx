import { Component } from "solid-js";
import { Accessor, Setter, Show, For } from "solid-js";
import { DateTime } from "luxon";
import Username from "components/Username";
import { SendMessageIcon } from "components/common/icon";
import { useI18n } from "@solid-primitives/i18n";
import { MessageOrDivider } from ".";
import Divider from "./Divider";
import Message from "./Message";

type Props = {
  messages: Accessor<MessageOrDivider[]>;
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
              {(message) => {
                if (message.type === "DIVIDER") {
                  return <Divider message={message} />;
                }

                return (
                  <div class="flex space-x-2">
                    <div>
                      {DateTime.fromSeconds(message.timestamp / 1000).toFormat(
                        "HH:mm:ss",
                      )}
                    </div>
                    <div class="flex space-x-1">
                      <Username
                        name={message.name}
                        property={message.property}
                        state={"state" in message ? message.state : undefined}
                      />
                      <Show when={message.type === "MESSAGE"}>:</Show>
                      <Message message={message} />
                    </div>
                  </div>
                );
              }}
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
