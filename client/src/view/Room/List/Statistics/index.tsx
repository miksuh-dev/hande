import { useI18n } from "@solid-primitives/i18n";
import { TabContainer } from "components/Tabs";
import useSnackbar from "hooks/useSnackbar";
import { DateTime } from "luxon";
import { Component, createSignal, onMount } from "solid-js";
import trpcClient from "trpc";
import { Statistic, StatisticsInput } from "trpc/types";
import Filter from "./Filter";
import Statistics from "./Statistics";

export type FormData = {
  after: StatisticsInput["after"];
};

const StatisticsComponent: Component = () => {
  const snackbar = useSnackbar();
  const [t] = useI18n();

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
      <Statistics statistics={result} loading={loading} />
    </TabContainer>
  );
};

export default StatisticsComponent;
