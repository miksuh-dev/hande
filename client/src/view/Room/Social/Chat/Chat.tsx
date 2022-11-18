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
                  <Show
                    when={message.isSystem}
                    fallback={
                      <div class="flex font-bold ">
                        {message.username}
                        <Show when={message.isVerified}>
                          <svg
                            version="1.1"
                            viewBox="0,0,24,24"
                            xmlns="http://www.w3.org/2000/svg"
                            class="ml-2 h-4 w-4 self-center text-custom-primary-900"
                            fill="currentColor"
                          >
                            <path
                              d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"
                              fill="text-custom-primary-900"
                            />
                          </svg>
                        </Show>
                        :
                      </div>
                    }
                  >
                    <div class="flex  font-bold text-custom-primary-900">
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
            class="input"
            placeholder="Kirjoita viestisi tähän..."
            onChange={(e) => props.onChange(e.currentTarget.value)}
            value={props.currentMessage()}
          />
          <button
            type="submit"
            class="icon-button ml-2"
            onClick={() => props.onSubmit(props.currentMessage())}
          >
            <svg
              aria-hidden="true"
              class="before h-6 w-6 rotate-90 fill-custom-primary-800"
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
