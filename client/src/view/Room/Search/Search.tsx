import { SearchIcon } from "components/common/icon";
import { Component } from "solid-js";
import { Accessor, Setter } from "solid-js";

type Props = {
  text: Accessor<string>;
  onChange: Setter<string>;
  onFocus: (event: FocusEvent) => void;
  onSubmit: (data: string) => void;
  loading: Accessor<boolean>;
};

const Search: Component<Props> = (props) => {
  return (
    <form
      class="item-center flex"
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(props.text());
      }}
    >
      <div class="relative w-full">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span class="h-5 w-5 text-neutral-500 dark:text-neutral-400">
              <SearchIcon />
            </span>
          </div>
        </div>
        <input
          type="text"
          id="simple-search"
          class="input p-2.5 pl-10"
          placeholder="Hae kappaletta tai soittolistaa"
          required
          onChange={(e) => props.onChange(e.currentTarget.value)}
          onFocus={(e) => props.onFocus(e)}
          value={props.text()}
          disabled={props.loading()}
        />
      </div>
      <button
        type="submit"
        class="ml-2 rounded-lg border border-custom-primary-700 bg-custom-primary-900 p-2.5 text-sm font-medium text-white hover:bg-custom-primary-800 focus:outline-none dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800"
        onClick={() => props.onSubmit(props.text())}
        disabled={props.loading()}
      >
        <div class="h-5 w-5">
          <SearchIcon />
        </div>
        <span class="sr-only">Hae kappaletta tai soittolistaa</span>
      </button>
    </form>
  );
};

export default Search;
