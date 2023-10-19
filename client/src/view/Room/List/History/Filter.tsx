import { FilterIcon } from "components/common/icon";
import { Component } from "solid-js";
import { Accessor, Setter } from "solid-js";
import { useI18n } from "@solid-primitives/i18n";
import { FormData } from ".";

type Props = {
  formData: Accessor<FormData>;
  setFormData: Setter<FormData>;
  onSubmit: (formdata: FormData) => void;
  loading: Accessor<boolean>;
};

const FilterComponent: Component<Props> = (props) => {
  const [t] = useI18n();

  return (
    <>
      <form
        class="item-center flex flex-1 space-x-2"
        onSubmit={(e) => {
          e.preventDefault();
          props.onSubmit(props.formData());
        }}
      >
        <div class="flex w-full flex-row">
          <div class="flex w-full flex-row space-x-2">
            <input
              type="text"
              class="p-2.5"
              placeholder={t("history.text")}
              onChange={(e) =>
                props.setFormData((existing) => ({
                  ...existing,
                  text: e.currentTarget.value,
                }))
              }
              value={props.formData().text}
              disabled={props.loading()}
            />
            <input
              type="text"
              class="p-2.5"
              placeholder={t("history.user")}
              onChange={(e) =>
                props.setFormData((existing) => ({
                  ...existing,
                  user: e.currentTarget.value,
                }))
              }
              value={props.formData().user}
              disabled={props.loading()}
            />
          </div>
        </div>
        <button
          type="submit"
          class="rounded-lg border border-custom-primary-700 bg-custom-primary-900 p-2 text-sm font-medium text-white hover:bg-custom-primary-800 focus:outline-none dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800"
          disabled={props.loading()}
        >
          <FilterIcon />
          <span class="sr-only">Hae kappaletta</span>
        </button>
      </form>
    </>
  );
};

export default FilterComponent;
