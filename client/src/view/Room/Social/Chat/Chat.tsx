import { Component } from "solid-js";
import { Accessor, Setter, Show, For } from "solid-js";
import { DateTime } from "luxon";
import { IncomingMessage } from "trpc/types";
import { htmlDecode } from "utils/parse";

type Props = {
  messages: IncomingMessage[];
  currentMessage: Accessor<string>;
  onChange: Setter<string>;
  onSubmit: (data: string) => void;
  ref: HTMLDivElement | undefined;
};

const RoomChat: Component<Props> = (props) => {
  return (
    <div class="flex flex-1 flex-col">
      <div class="flex h-full flex-col bg-white dark:bg-neutral-900">
        <div class="flex-1 overflow-y-scroll px-1 pb-3">
          <Show
            when={props.messages.length}
            fallback={
              <div class="flex flex-col items-center text-black">
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
                  <Show
                    when={message.isSystem}
                    fallback={<div class="font-bold">{message.username}:</div>}
                  >
                    <div class="font-bold text-custom-aqua-900">
                      {message.username}:
                    </div>
                  </Show>
                  <div>{htmlDecode(message.content)}</div>
                </div>
              )}
            </For>
            <div ref={props.ref} />
          </Show>
        </div>
        <form class="flex" onSubmit={(e) => e.preventDefault()}>
          <input
            id="chat"
            type="text"
            class="block w-full rounded-lg border border-neutral-300 bg-white p-2.5 text-sm text-gray-900 focus:border-custom-aqua-500 focus:ring-custom-aqua-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-gray-400"
            placeholder="Kirjoita viestisi tähän..."
            onChange={(e) => props.onChange(e.currentTarget.value)}
            value={props.currentMessage()}
          />
          <button
            type="submit"
            class="ml-2 inline-flex cursor-pointer  justify-center rounded-full p-2 text-custom-aqua-600 hover:bg-blue-100 dark:text-custom-aqua-500 dark:hover:bg-neutral-600"
            onClick={() => props.onSubmit(props.currentMessage())}
          >
            <svg
              aria-hidden="true"
              class="before h-6 w-6 rotate-90 fill-custom-aqua-700"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            <span class="sr-only">Send message</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomChat;
