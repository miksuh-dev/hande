import { useI18n } from "@solid-primitives/i18n";
import Dialog from "components/Dialog";
import Loading from "components/Loading";
import useSnackbar from "hooks/useSnackbar";
import { Component, createSignal, onMount, Show } from "solid-js";
import trpcClient from "trpc";

type Props = {
  onClose: () => void;
};

const ChangeLog: Component<Props> = (props) => {
  const snackbar = useSnackbar();
  const [t] = useI18n();

  const [loading, setLoading] = createSignal(false);
  const [result, setResult] = createSignal<ReturnType<
    typeof trpcClient.common.changelog.query
  > | null>(null);

  onMount(async () => {
    try {
      setLoading(true);

      const result = await trpcClient.common.changelog.query();

      setResult(result);
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(t("error.common", { error: err.message }));
      }
    } finally {
      setLoading(false);
    }
  });

  return (
    <Dialog title={t("navigation.changelog")} onClose={() => props.onClose()}>
      <Show when={!loading()} fallback={<Loading />}>
        <div
          class="markdown px-3"
          // eslint-disable-next-line solid/no-innerhtml
          innerHTML={result()}
        />
      </Show>
    </Dialog>
  );
};

export default ChangeLog;
