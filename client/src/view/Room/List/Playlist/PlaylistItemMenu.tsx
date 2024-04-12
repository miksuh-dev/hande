import { useI18n } from "@solid-primitives/i18n";
import { Accessor, Component, Show } from "solid-js";
import { SongClient } from "trpc/types";
import useSnackbar from "hooks/useSnackbar";
import trpcClient from "trpc";
import MenuItem from "components/UserMenu/MenuItem";
import trackClickOutside from "utils/trackClickOutside";

type Props = {
  song: Accessor<SongClient>;
  open: Accessor<boolean>;
  onClose: () => void;
};

const PlaylistItemMenu: Component<Props> = (props) => {
  const [t] = useI18n();
  const snackbar = useSnackbar();

  const handleSongReportSong = async (song: SongClient) => {
    try {
      snackbar.success(t(`snackbar.source.song.reportedSong`));

      await trpcClient.room.reportSongBroken.mutate({
        songId: song.id,
      });

      snackbar.success(t(`snackbar.source.song.reportedSongBroken`));
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(
          t("error.common", { error: t(err.message) || err.message })
        );
      }
    }
  };

  return (
    <>
      <Show when={props.open()}>
        <div
          class="relative"
          ref={(ref) =>
            trackClickOutside(ref, () => {
              props.onClose();
            })
          }
        >
          <div class="tooltip absolute right-0 -top-1 z-50 my-4 w-[175px] list-none divide-y divide-neutral-200 text-base">
            <div>
              <MenuItem
                onClick={() => {
                  handleSongReportSong(props.song());
                  props.onClose();
                }}
              >
                {t("actions.reportSongBroken")}
              </MenuItem>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};

export default PlaylistItemMenu;
