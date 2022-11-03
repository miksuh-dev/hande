import type { Component } from "solid-js";
import { createSignal, createEffect } from "solid-js";
import trpcClient from "trpc";
import Chat from "./Chat";
import { IncomingMessage } from "trpc/types";

type Props = {
  messages: IncomingMessage[];
};

const RoomChat: Component<Props> = (props) => {
  const [message, setMessage] = createSignal("");

  let ref: HTMLDivElement | undefined = undefined;

  const handleSendMessage = async (content: string) => {
    try {
      if (content.length > 0) {
        await trpcClient.room.message.mutate({
          content,
        });

        setMessage("");
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log("e", e);
      }
    }
  };

  createEffect(() => {
    if (props.messages.length && ref) {
      ref.scrollIntoView({ behavior: "smooth" });
    }
  });

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
