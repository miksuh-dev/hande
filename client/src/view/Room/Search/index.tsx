import { Component, createEffect, createSignal, Show } from "solid-js";
import trpcClient from "trpc";
import Result from "./Result";
import Search from "./Search";
import { SearchResult } from "trpc/types";
import useSnackbar from "hooks/useSnackbar";
import { htmlDecode } from "utils/parse";
import { RoomData } from "../data";
import { useRouteData } from "@solidjs/router";
import trackClickOutside from "utils/trackClickOutside";
import { Source } from "trpc/types";

const SearchComponent: Component = () => {
  const roomData = useRouteData<RoomData>();

  const snackbar = useSnackbar();
  const [text, setText] = createSignal("");
  const [results, setResults] = createSignal<SearchResult[]>([]);
  const [resultsOpen, setResultsOpen] = createSignal(false);
  const [source, setSource] = createSignal<Source>();
  const [loading, setLoading] = createSignal(false);

  createEffect(() => {
    if (!source() && roomData().sources.length > 0) {
      setSource(roomData().sources[0]);
    }
  });

  const onSubmit = async (
    searchText: string,
    selectedSource: Source | undefined
  ) => {
    if (!searchText || !selectedSource) return;

    try {
      setLoading(true);
      setResultsOpen(true);

      const suggestions = await trpcClient.room.search.query({
        text: searchText,
        source: selectedSource.value,
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

  const handleAdd = async (result: SearchResult) => {
    try {
      const song = await trpcClient.room.addSong.mutate({
        contentId: result.contentId,
        url: result.url,
        title: result.title,
        thumbnail: result.thumbnail?.url ?? null,
        type: result.type,
      });

      snackbar.success(`Lisätty jonoon "${htmlDecode(song.title)}"`);
    } catch (error) {
      if (error instanceof Error) {
        snackbar.error(error.message);
      }
    }
  };

  const handleSourceChange = (newSource: Source) => {
    setResults([]);
    setSource(newSource);
  };

  return (
    <div
      class="relative z-20 flex flex-col rounded-md bg-white dark:bg-neutral-900"
      classList={{
        "shadow-sm": resultsOpen(),
        "rounded-b-none": resultsOpen(),
      }}
      ref={(ref) => {
        trackClickOutside(ref, (open) => {
          setResultsOpen(open);
        });
      }}
    >
      <div class="p-2">
        <Search
          text={text}
          selectedSource={source}
          sources={roomData().sources}
          onSubmit={onSubmit}
          onSourceChange={handleSourceChange}
          onTextChange={setText}
          onFocus={handleSearchFocus}
          loading={loading}
        />
      </div>
      <Show when={resultsOpen()}>
        <Result
          results={results}
          songs={roomData().songs}
          onAdd={handleAdd}
          onClose={() => setResultsOpen(false)}
          loading={loading}
        />
      </Show>
    </div>
  );
};

export default SearchComponent;
