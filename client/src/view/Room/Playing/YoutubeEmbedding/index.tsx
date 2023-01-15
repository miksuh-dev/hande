import useSnackbar from "hooks/useSnackbar";
import { DateTime } from "luxon";
import { Component, onMount } from "solid-js";
import { PlayingSong } from "trpc/types";
import { useI18n } from "@solid-primitives/i18n";
import { CustomWindow, ReadyEvent } from "./types";

declare let window: CustomWindow;

type Props = {
  song: PlayingSong;
};

const PlayingComponent: Component<Props> = (props) => {
  const [t] = useI18n();
  const snackbar = useSnackbar();

  const onYoutubeScriptReady = () => {
    const YT = window.YT;

    if (!YT) {
      snackbar.error(t("error.youtubeEmbeddingScript"));
      return;
    }

    YT?.ready(function () {
      new YT.Player("player", {
        videoId: props.song.contentId,
        events: {
          onReady: onPlayerReady,
        },
      });
    });
  };

  onMount(() => {
    if (window.YT) {
      onYoutubeScriptReady();
    } else {
      const tag = document.createElement("script");

      tag.async = true;
      tag.src = "https://www.youtube.com/iframe_api";
      tag.id = "youtube-iframe-api";
      tag.onload = () => onYoutubeScriptReady();

      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag?.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    }
  });

  const onPlayerReady = (event: ReadyEvent) => {
    const startTime = DateTime.utc().diff(
      DateTime.fromISO(props.song.startedAt, { zone: "utc" }),
      "seconds"
    ).seconds;

    event.target.seekTo(Math.round(startTime));
  };

  return (
    <iframe
      id="player"
      src={`https://www.youtube.com/embed/${props.song.contentId}?rel=0&autoplay=0&mute=1&controls=0&showInfo=0&modestbranding=1&enablejsapi=1&origin=${window.location.origin}`}
      width="540"
      height="300"
      frame-border="0"
      allowfullscreen
    />
  );
};

export default PlayingComponent;
