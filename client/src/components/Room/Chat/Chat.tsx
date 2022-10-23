import { Component } from "solid-js";
import { Accessor, Setter, Show, For } from "solid-js";
import { DateTime } from "luxon";
import { IncomingMessage } from "trpc/types";

type Props = {
  messages: Accessor<IncomingMessage[]>;
  currentMessage: Accessor<string>;
  onChange: Setter<string>;
  onSubmit: (data: string) => void;
  ref: HTMLDivElement | undefined;
};

const RoomChat: Component<Props> = (props) => {
  return (
    <div class="flex flex-1 flex-col">
      <div class="border-grey-200 border-b-2 bg-gray-100 py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:bg-gray-700 dark:text-gray-400">
        Chat ja toive historia
      </div>
      <div class="flex h-full flex-col bg-white p-2">
        <div class="flex-1 overflow-y-auto">
          <Show
            when={props.messages().length}
            fallback={
              <div class="flex flex-col items-center text-white">
                Ei viestejä
              </div>
            }
          >
            <For each={props.messages()}>
              {(message) => (
                <div class="flex space-x-2">
                  <div>
                    {DateTime.fromSeconds(message.timestamp).toFormat(
                      "HH:mm:ss"
                    )}
                  </div>
                  <div class="font-bold">{message.username}:</div>
                  <div>{message.content}</div>
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
            class="mx-2 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Your message..."
            onChange={(e) => props.onChange(e.currentTarget.value)}
            value={props.currentMessage()}
          />
          <button
            type="submit"
            class="inline-flex cursor-pointer  justify-center rounded-full p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
            onClick={() => props.onSubmit(props.currentMessage())}
          >
            <svg
              aria-hidden="true"
              class="before h-6 w-6 rotate-90 fill-custom-aqua-700"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
            <span class="sr-only">Send message</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomChat;
