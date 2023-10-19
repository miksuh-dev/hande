import { SingleArrowLeft, SingleArrowRight } from "components/common/icon";
import { Component, createMemo, For } from "solid-js";

interface Props {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

const PAGES_TO_SHOW = 2;

const PaginationComponent: Component<Props> = (props) => {
  const handlePreviousClick = () => {
    const previousPage = props.currentPage > 1 ? props.currentPage - 1 : 0;
    props.onPageChange(previousPage);
  };

  const handleNextClick = () => {
    const nextPage =
      props.currentPage + 1 > props.pageCount
        ? props.pageCount
        : props.currentPage + 1;

    props.onPageChange(nextPage);
  };

  const leftPages = createMemo(() => {
    const pages: number[] = [];

    const min =
      props.currentPage - PAGES_TO_SHOW > 1
        ? props.currentPage - PAGES_TO_SHOW
        : 1;

    for (let i = min; i < props.currentPage; i++) {
      pages.push(i);
    }

    return pages;
  });

  const rightPages = createMemo(() => {
    const pages: number[] = [];

    const max =
      props.currentPage + PAGES_TO_SHOW < props.pageCount
        ? props.currentPage + PAGES_TO_SHOW
        : props.pageCount;

    for (let i = props.currentPage + 1; i <= max; i++) {
      pages.push(i);
    }

    return pages;
  });

  return (
    <nav class="flex">
      <button
        disabled={props.currentPage === 1}
        onClick={() => handlePreviousClick()}
        class="rounded-l-md border border-neutral-300 bg-white px-3 py-2 leading-tight text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 disabled:hover:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 dark:hover:text-white dark:disabled:bg-neutral-800"
      >
        <span class="sr-only">Previous</span>
        <SingleArrowLeft />
      </button>
      <For each={[...leftPages(), props.currentPage, ...rightPages()]}>
        {(page) => (
          <button
            onClick={() => {
              if (props.currentPage === page) return;

              props.onPageChange(page);
            }}
            class="border border-neutral-300 px-3 py-2 leading-tight dark:border-neutral-700 "
            classList={{
              "hover:text-neutral-700 dark:hover:bg-neutral-600 dark:hover:text-white bg-neutral-300 hover:bg-neutral-300 text-neutral-900 dark:bg-neutral-600 dark:text-white cursor-default":
                page === props.currentPage,
              "hover:text-neutral-800 dark:hover:bg-neutral-700 dark:hover:text-white bg-neutral-100 hover:bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100":
                page !== props.currentPage,
            }}
          >
            {page}
          </button>
        )}
      </For>
      <button
        disabled={props.currentPage === props.pageCount}
        onClick={() => handleNextClick()}
        class="rounded-r-md border border-neutral-300 bg-white px-3 py-2 leading-tight text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 disabled:hover:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 dark:hover:text-white dark:disabled:bg-neutral-800"
      >
        <span class="sr-only">Next</span>
        <SingleArrowRight />
      </button>
    </nav>
  );
};

export default PaginationComponent;
