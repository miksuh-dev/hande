import { Song, VoteType } from "trpc/types";
import useSnackbar from "hooks/useSnackbar";
import { Accessor, Component, Setter } from "solid-js";
import trpcClient from "trpc";
import Playing from "./Playing";
import { htmlDecode } from "utils/parse";
import { useI18n } from "@solid-primitives/i18n";

type Props = {
  showVideo: Accessor<boolean>;
  setShowVideo: Setter<boolean>;
};

const PlayingComponent: Component<Props> = (props) => {
  const [t] = useI18n();

  const snackbar = useSnackbar();

  const handleSkip = async (song: Song) => {
    try {
      const skippedSong = await trpcClient.room.skipCurrent.mutate({
        id: song.id,
      });

      snackbar.success(
        t(`snackbar.source.${skippedSong.type}.skipped`, {
          item: htmlDecode(skippedSong.title),
        }),
      );
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(t("error.common", { error: err.message }));
      }
    }
  };

  const handleVote = async (
    songId: number,
    contentId: string,
    vote: VoteType,
  ) => {
    try {
      await trpcClient.room.voteSong.mutate({
        songId,
        contentId,
        vote,
      });

      snackbar.success(t("snackbar.common.voted"));
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(t(err.message) ?? err.message);
      }
    }
  };

  return (
    <Playing
      showVideo={props.showVideo}
      setShowVideo={props.setShowVideo}
      onSkip={handleSkip}
      onVote={handleVote}
    />
  );
};

export default PlayingComponent;
