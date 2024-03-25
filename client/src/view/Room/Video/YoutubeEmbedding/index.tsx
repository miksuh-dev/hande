import { DateTime } from "luxon";
import { Accessor, Component, onMount } from "solid-js";
import { PlayingSongClient, SongType } from "trpc/types";
import { CustomWindow } from "./types";
import useSnackbar from "hooks/useSnackbar";
import { useI18n } from "@solid-primitives/i18n";

declare let window: CustomWindow;

type Props = {
  song: Accessor<PlayingSongClient<SongType.SONG>>;
  rect: Accessor<DOMRect | undefined>;
};

const onYoutubeScriptReady = (contentId: string, startedAt: string) => {
  const YT = window.YT;

  if (!YT) {
    throw Error("error.youtubeEmbeddingScript");
  }

  YT?.ready(function () {
    new YT.Player("player", {
      videoId: contentId,
      events: {
        onReady: (event) => {
          const startTime = getStartTime(startedAt);

          event.target.seekTo(Math.ceil(startTime + 2));
        },
      },
    });
  });
};

const getStartTime = (startedAt: string) => {
  return DateTime.utc().diff(
    DateTime.fromISO(startedAt, { zone: "utc" }),
    "seconds"
  ).seconds;
};

const PlayingComponent: Component<Props> = (props) => {
  const [t] = useI18n();
  const snackbar = useSnackbar();

  onMount(() => {
    const { contentId, startedAt } = props.song();

    if (window.YT) {
      onYoutubeScriptReady(contentId, startedAt);
      return;
    }

    const tag = document.createElement("script");

    tag.async = true;
    tag.src = "https://www.youtube.com/iframe_api";
    tag.id = "youtube-iframe-api";
    tag.onload = () => {
      try {
        onYoutubeScriptReady(contentId, startedAt);
      } catch (err) {
        if (err instanceof Error) {
          snackbar.error(t(err.message));
        }
      }
    };

    const firstScriptTag = document.getElementsByTagName("script")[0];
    if (firstScriptTag?.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  });

  return (
    <iframe
      id="player"
      src={`https://www.youtube.com/embed/${
        props.song().contentId
      }?rel=0&autoplay=0&mute=1&controls=0&showInfo=0&modestbranding=1&enablejsapi=1&origin=${
        window.location.origin
      }`}
      width={props.rect()?.width ?? 300}
      height={props.rect()?.height ?? 300}
      frame-border="0"
      allowfullscreen
    />
  );
};

export default PlayingComponent;
