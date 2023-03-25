import { useI18n } from "@solid-primitives/i18n";
import { useRouteData } from "@solidjs/router";
import { TabContainer } from "components/Tabs";
import useSnackbar from "hooks/useSnackbar";
import { Component, createMemo, createSignal, onMount } from "solid-js";
import trpcClient from "trpc";
import { ListHistory, Song } from "trpc/types";
import { htmlDecode } from "utils/parse";
import { RoomData } from "../../data";
import Filter from "./Filter";
import Footer from "./Footer";
import History from "./History";

export type FormData = {
  text: string;
  user: string;
  page: number;
};

const HistoryComponent: Component = () => {
  const snackbar = useSnackbar();
  const [t] = useI18n();

  const { room } = useRouteData<RoomData>();

  const [loading, setLoading] = createSignal(false);
  const [formData, setFormData] = createSignal<FormData>({
    text: "",
    user: "",
    page: 1,
  });
  const [result, setResult] = createSignal<ListHistory>();
  const [selected, setSelected] = createSignal<Song[]>([]);

  onMount(() => {
    handleSubmit(formData());
  });

  const pageCount = createMemo(() => {
    const { total, pageSize } = result() ?? {};

    if (!total || !pageSize) {
      return 1;
    }

    return Math.ceil(total / pageSize);
  });

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);

      const { text, user, page } = formData;
      const result = await trpcClient.room.listHistory.query({
        text,
        user,
        page,
      });

      setResult(result);
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(t("error.common", { error: err.message }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (result: Song[]) => {
    try {
      const addedSongs = result.map((r) => {
        if (r.type !== "song") {
          throw new Error("Only songs can be added to the queue");
        }

        return {
          contentId: r.contentId,
          url: r.url,
          title: r.title,
          thumbnail: r.thumbnail ?? null,
          type: r.type as "song",
        };
      });

      const songs = await trpcClient.room.addSong.mutate(addedSongs);

      if (songs.length > 1) {
        snackbar.success(
          t(`snackbar.source.song.addedManyToQueue`, {
            count: songs.length.toString(),
          })
        );
      } else if (songs[0]) {
        const song = songs[0];

        snackbar.success(
          t(`snackbar.source.${song.type}.addedToQueue`, {
            item: htmlDecode(song.title),
          })
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        snackbar.error(t("snackbar.error", { error: error.message }));
      }
    }
  };

  const isInQueue = (song: Song) => {
    const { playing, songs } = room();

    return (
      songs.some((s) => s.contentId === song.contentId) ||
      (playing && playing.contentId === song.contentId)
    );
  };

  const handleSongSelect = (song: Song) => {
    const isSelected = selected().some((s) => s.contentId === song.contentId);

    if (isSelected) {
      setSelected(selected().filter((s) => s.contentId !== song.contentId));
    } else if (!isInQueue(song)) {
      setSelected([...selected(), song]);
    }
  };

  const handleSelectAll = () => {
    const { playing, songs } = room();

    const newSelected = (result()?.list ?? []).filter(
      (s) =>
        !songs.some((ps) => s.contentId === ps.contentId) &&
        (!playing || playing.contentId !== s.contentId)
    );

    const updatedSelected = [...selected(), ...newSelected];
    const contentIds = updatedSelected.map((o) => o.contentId);

    setSelected(
      updatedSelected.filter(
        ({ contentId }, index) => !contentIds.includes(contentId, index + 1)
      )
    );
  };

  return (
    <TabContainer
      actions={
        <Filter
          formData={formData}
          setFormData={setFormData}
          onSubmit={() => {
            setFormData({ ...formData(), page: 1 });
            handleSubmit(formData());
          }}
          loading={loading}
        />
      }
      footer={
        <Footer
          page={formData().page}
          onPageChange={(page) => {
            setFormData({ ...formData(), page });
            handleSubmit(formData());
          }}
          pageCount={pageCount()}
          onSelectAll={() => handleSelectAll()}
          onClear={() => setSelected([])}
          onSubmit={() => handleAdd(selected())}
        />
      }
    >
      <History
        playing={room().playing}
        songs={room().songs}
        history={result()?.list ?? []}
        onSongSelect={handleSongSelect}
        selected={selected}
        isInQueue={isInQueue}
        loading={loading}
      />
    </TabContainer>
  );
};

export default HistoryComponent;
