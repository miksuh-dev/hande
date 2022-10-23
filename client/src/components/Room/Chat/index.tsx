import type { Component } from "solid-js";
import { Accessor } from "solid-js";
import { createSignal, createEffect, on } from "solid-js";
import trpcClient from "trpc";
import Chat from "./Chat";
import { IncomingMessage } from "trpc/types";

type Props = {
  messages: Accessor<IncomingMessage[]>;
};

const RoomChat: Component<Props> = (props) => {
  const [message, setMessage] = createSignal("");

  let ref: HTMLDivElement | undefined = undefined;

  const handleSendMessage = async (content: string) => {
    try {
      await trpcClient.room.message.mutate({
        content,
      });

      setMessage("");
    } catch (e) {
      if (e instanceof Error) {
        console.log("e", e);
      }
    }
  };

  createEffect(
    on(
      props.messages,
      (messages) => {
        if (messages.length && ref) {
          ref.scrollIntoView({ behavior: "smooth" });
        }
      },
      { defer: true }
    )
  );

  return (
    <Chat
      currentMessage={message}
      messages={props.messages}
      onChange={setMessage}
      onSubmit={(data) => handleSendMessage(data)}
      ref={ref}
    />
  );
};

export default RoomChat;
