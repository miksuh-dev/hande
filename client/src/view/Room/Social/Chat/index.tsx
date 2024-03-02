import { Component, createMemo } from "solid-js";
import { createSignal, createEffect } from "solid-js";
import trpcClient from "trpc";
import Chat from "./Chat";
import { IncomingMessage } from "trpc/types";
import { DateTime } from "luxon";
import { useRouteData } from "@solidjs/router";
import type { RoomData } from "view/Room/data";

type Props = {
  messages: IncomingMessage[];
};

export type Divider = Omit<
  IncomingMessage,
  "type" | "content" | "name" | "property"
> & {
  type: "DIVIDER";
};

export type MessageOrDivider = IncomingMessage | Divider;

const RoomChat: Component<Props> = (props) => {
  const [message, setMessage] = createSignal("");

  const { room } = useRouteData<RoomData>();

  let ref: HTMLDivElement | undefined = undefined;

  const messages = createMemo(() => {
    return props.messages.reduce((acc, message) => {
      const prev = acc[acc.length - 1];

      const currentDt = DateTime.fromMillis(message.timestamp).setZone("local");
      const startOfDay = currentDt.startOf("day");

      const dateChange = prev
        ? !DateTime.fromSeconds(prev.timestamp / 1000)
            .setZone("local")
            .hasSame(currentDt, "day")
        : !DateTime.now().setZone("local").hasSame(startOfDay, "day");

      if (dateChange) {
        const divider: Divider = {
          id: startOfDay.toMillis().toString(),
          timestamp: startOfDay.toMillis(),
          type: "DIVIDER",
        };

        return [...acc, divider, message];
      }

      return [...acc, message];
    }, new Array<MessageOrDivider>());
  });

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
      ref.scrollIntoView({ behavior: "auto" });
    }

    return room()?.playing?.id;
  });

  return (
    <Chat
      currentMessage={message}
      messages={messages}
      onChange={setMessage}
      onSubmit={(data) => handleSendMessage(data)}
      ref={ref}
    />
  );
};

export default RoomChat;
