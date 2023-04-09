import { useI18n } from "@solid-primitives/i18n";
import { useRouteData } from "@solidjs/router";
import { TabContainer } from "components/Tabs";
import useSnackbar from "hooks/useSnackbar";
import { DateTime } from "luxon";
import { Component, createSignal, onMount } from "solid-js";
import trpcClient from "trpc";
import { AddSongInput, Statistic, StatisticsInput } from "trpc/types";
import { htmlDecode } from "utils/parse";
import { RoomData } from "view/Room/data";
import Filter from "./Filter";
import Statistics from "./Statistics";

export type FormData = {
  after: StatisticsInput["after"];
};

const StatisticsComponent: Component = () => {
  const snackbar = useSnackbar();
  const [t] = useI18n();
  const { room } = useRouteData<RoomData>();

  const [loading, setLoading] = createSignal(false);
  const [formData, setFormData] = createSignal<FormData>({
    after: DateTime.now().minus({ days: 7 }).toISO(),
  });
  const [result, setResult] = createSignal<Statistic[]>([]);

  onMount(() => {
    handleSubmit(formData());
  });

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);

      const { after } = formData;
      const result = await trpcClient.room.getStatistics.query({
        after,
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

  const handleAdd = async (result: AddSongInput) => {
    try {
      const songs = await trpcClient.room.addSong.mutate(
        result.map((r) => ({
          contentId: r.contentId,
          url: r.url,
          title: r.title,
          thumbnail: r.thumbnail ?? null,
          type: r.type,
        }))
      );

      const song = songs[0];

      snackbar.success(
        t(`snackbar.source.${song.type}.addedToQueue`, {
          item: htmlDecode(song.title),
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        snackbar.error(t("snackbar.error", { error: error.message }));
      }
    }
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
    >
      <Statistics
        statistics={result}
        songs={room().songs}
        playing={room().playing}
        onAdd={handleAdd}
        loading={loading}
      />
    </TabContainer>
  );
};

export default StatisticsComponent;
