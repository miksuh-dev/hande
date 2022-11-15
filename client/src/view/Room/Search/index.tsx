import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
import trpcClient from "trpc";
import Result from "./Result";
import Search from "./Search";
import { YoutubeSearchResult } from "trpc/types";
import useSnackbar from "hooks/useSnackbar";

const SearchComponent: Component = () => {
  const snackbar = useSnackbar();
  const [text, setText] = createSignal("");
  const [results, setResults] = createSignal<YoutubeSearchResult[]>([]);
  const [resultsOpen, setResultsOpen] = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  let containerRef: HTMLDivElement | undefined = undefined;

  const onSubmit = async (searchText: string) => {
    try {
      setLoading(true);
      setResultsOpen(true);

      const suggestions = await trpcClient.youtube.search.query({
        text: searchText,
      });

      setResults(suggestions);
    } catch (error) {
      if (error instanceof Error) {
        snackbar.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchFocus = (e: FocusEvent) => {
    e.stopPropagation();
    if (results().length > 0) {
      setResultsOpen(true);
    }
  };

  const handleAdd = async (result: YoutubeSearchResult) => {
    try {
      const song = await trpcClient.room.addSong.mutate({
        videoId: result.videoId,
        title: result.title,
        thumbnail: result.thumbnail.url,
      });

      snackbar.success(`Lisätty jonoon ${song.title}`);
    } catch (error) {
      if (error instanceof Error) {
        snackbar.error(error.message);
      }
    }
  };

  onMount(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setResultsOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        if (!containerRef?.contains(e.target)) {
          setResultsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", close);
    window.addEventListener("click", onClick);

    onCleanup(() => {
      window.removeEventListener("keydown", close);
      window.removeEventListener("click", onClick);
    });
  });

  return (
    <div
      class="relative flex flex-col rounded-md bg-white"
      classList={{
        "shadow-sm": resultsOpen(),
        "rounded-b-none": resultsOpen(),
      }}
      ref={containerRef}
    >
      <div class="p-2">
        <Search
          text={text}
          onSubmit={onSubmit}
          onChange={setText}
          onFocus={handleSearchFocus}
          loading={loading}
        />
      </div>
      <Show when={resultsOpen()}>
        <Result
          results={results}
          onAdd={handleAdd}
          onClose={() => setResultsOpen(false)}
          loading={loading}
          containerRef={containerRef}
        />
      </Show>
    </div>
  );
};

export default SearchComponent;
