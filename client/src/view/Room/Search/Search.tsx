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
            class="h-5 w-5 text-gray-500 dark:text-gray-400"
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
              class="h-5 w-5 text-gray-500 dark:text-gray-400"
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
          class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-sm text-gray-900 focus:border-custom-aqua-500 focus:ring-custom-aqua-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-custom-aqua-500 dark:focus:ring-custom-aqua-500"
          placeholder="Hae kappaletta tai soittolistaa"
          required
          onChange={(e) => props.onChange(e.currentTarget.value)}
          onFocus={props.onFocus}
          value={props.text()}
          disabled={props.loading()}
        />
      </div>
      <button
        type="submit"
        class="ml-2 rounded-lg border border-custom-aqua-700 bg-custom-aqua-900  p-2.5 text-sm font-medium text-white hover:bg-custom-aqua-800 focus:outline-none focus:ring-4 focus:ring-custom-aqua-300 dark:bg-custom-aqua-600 dark:hover:bg-custom-aqua-700 dark:focus:ring-custom-aqua-800"
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
