import { Component, createSignal } from "solid-js";
import { Accessor, Setter } from "solid-js";
import { StatisticsInput } from "trpc/types";
import { useI18n } from "@solid-primitives/i18n";
import { FormData } from ".";
import { DateTime } from "luxon";
import Select, { Option } from "components/Select";

type Props = {
  formData: Accessor<FormData>;
  setFormData: Setter<FormData>;
  onSubmit: (formdata: FormData) => void;
  loading: Accessor<boolean>;
};

type AfterOption = {
  name: string;
  value: StatisticsInput["after"];
};

const FilterComponent: Component<Props> = (props) => {
  const [t] = useI18n();

  const filterOptions: AfterOption[] = [
    {
      name: t("statistics.filter.last7days"),
      value: DateTime.now().minus({ days: 7 }).setZone("utc").toISO(),
    },
    {
      name: t("statistics.filter.lastMonth"),
      value: DateTime.now().minus({ months: 1 }).setZone("utc").toISO(),
    },
    {
      name: t("statistics.filter.last3months"),
      value: DateTime.now().minus({ months: 3 }).setZone("utc").toISO(),
    },
    {
      name: t("statistics.filter.lastYear"),
      value: DateTime.now().minus({ year: 1 }).setZone("utc").toISO(),
    },
    {
      name: t("statistics.filter.allTime"),
      value: DateTime.now().minus({ year: 99 }).setZone("utc").toISO(),
    },
  ];

  const [after, setAfter] = createSignal<string | undefined>(
    filterOptions[0]?.value,
  );

  const handleSelect = (option: Option) => {
    setAfter(option.value);

    props.setFormData({ after: option.value });
    props.onSubmit({ after: option.value });
  };

  return (
    <div class="flex flex-1">
      <Select
        options={filterOptions}
        selectedSource={filterOptions.find(
          (option) => option.value === after(),
        )}
        onSelect={(option) => handleSelect(option)}
      />
    </div>
  );
};

export default FilterComponent;
