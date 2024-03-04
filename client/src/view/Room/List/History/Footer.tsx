import { useI18n } from "@solid-primitives/i18n";
import Pagination from "components/Pagination";
import Tooltip from "components/Tooltip";
import { Accessor, Component } from "solid-js";
import { SongClient } from "trpc/types";

type Props = {
  selected: Accessor<SongClient[]>;
  page: number;
  onPageChange: (page: number) => void;
  pageCount: number;
  onSelectAll: () => void;
  onClear: () => void;
  onSubmit: () => void;
};

const FooterComponent: Component<Props> = (props) => {
  const [t] = useI18n();

  return (
    <div class="flex flex-1 items-center space-x-2">
      <div class="-mt-2 flex-1 space-y-2">
        <button
          type="button"
          class="inline-flex shrink-0 items-center rounded border border-transparent bg-custom-primary-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-custom-primary-800 focus:outline-none focus:ring-2 focus:ring-custom-primary-500 focus:ring-offset-2 dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800 dark:focus:ring-custom-primary-500 sm:mr-2"
          onClick={() => props.onSelectAll()}
        >
          {t("actions.selectAll")}
        </button>
        <button
          type="button"
          class="inline-flex shrink-0 items-center rounded border border-transparent bg-custom-primary-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-custom-primary-800 focus:outline-none focus:ring-2 focus:ring-custom-primary-500 focus:ring-offset-2 dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800 dark:focus:ring-custom-primary-500 sm:mr-2"
          onClick={() => props.onClear()}
        >
          {t("actions.clearSelections")}
        </button>
      </div>
      <Pagination
        currentPage={props.page}
        pageCount={props.pageCount}
        onPageChange={(page) => props.onPageChange(page)}
      />
      <div class="flex flex-1 justify-end">
        <Tooltip
          text={t("tooltip.common.noSelections")}
          visible={props.selected().length === 0}
        >
          <button
            type="button"
            class="ml-auto inline-flex shrink-0 items-center rounded border border-transparent bg-custom-primary-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-custom-primary-800 focus:outline-none focus:ring-2 focus:ring-custom-primary-500 focus:ring-offset-2 dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800 dark:focus:ring-custom-primary-500"
            onClick={() => props.onSubmit()}
            disabled={props.selected().length === 0}
          >
            {t("actions.addSelected")}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default FooterComponent;
