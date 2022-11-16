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
          <svg
            aria-hidden="true"
            class="h-5 w-5 text-neutral-500 dark:text-neutral-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              aria-hidden="true"
              class="h-5 w-5 text-neutral-500 dark:text-neutral-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
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
        class="ml-2 rounded-lg border border-custom-primary-700 bg-custom-primary-900  p-2.5 text-sm font-medium text-white hover:bg-custom-primary-800 focus:outline-none focus:ring-4 focus:ring-custom-primary-300 dark:bg-custom-primary-900 dark:hover:bg-custom-primary-800 dark:focus:ring-custom-primary-500"
        onClick={() => props.onSubmit(props.text())}
        disabled={props.loading()}
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span class="sr-only">Hae kappaletta tai soittolistaa</span>
      </button>
    </form>
  );
};

export default Search;
