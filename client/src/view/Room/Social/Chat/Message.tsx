import { useI18n } from "@solid-primitives/i18n";
import { Component, createMemo } from "solid-js";
import { IncomingMessage } from "trpc/types";
import { htmlDecode } from "utils/parse";
import { isSystemMessage } from "utils/user";
import ChatMessageItem from "view/Room/Social/Chat/ChatMessageItem";

const Message: Component<{ message: IncomingMessage }> = (props) => {
  const [t] = useI18n();

  const content = createMemo(() => {
    if (props.message.item) {
      return (
        <ChatMessageItem
          content={props.message.content}
          item={props.message.item}
          error={"error" in props.message ? props.message.error : undefined}
        />
      );
    }

    if (props.message.error) {
      return (
        <>
          {t(props.message.content, {
            error: props.message.error ?? "",
          })}
        </>
      );
    }

    if (
      ["ACTION", "JOIN", "LEAVE"].includes(props.message.type) ||
      isSystemMessage(props.message)
    ) {
      return (
        <>{t(props.message.content) ?? htmlDecode(props.message.content)}</>
      );
    }

    return <>{htmlDecode(props.message.content)}</>;
  });

  return (
    <div
      classList={{
        italic: props.message.type !== "MESSAGE",
        "normal-case": props.message.type === "MESSAGE",
      }}
    >
      {content()}
    </div>
  );
};

export default Message;
