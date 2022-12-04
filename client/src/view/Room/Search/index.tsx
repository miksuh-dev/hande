import { Component, createSignal, Resource, Show } from "solid-js";
import trpcClient from "trpc";
import Result from "./Result";
import Search from "./Search";
import { YoutubeSearchResult } from "trpc/types";
import useSnackbar from "hooks/useSnackbar";
import { htmlDecode } from "utils/parse";
import { RoomData } from "../data";
import { useRouteData } from "@solidjs/router";
import trackClickOutside from "utils/trackClickOutside";

const SearchComponent: Component = () => {
  const snackbar = useSnackbar();
  const [text, setText] = createSignal("");
  const [results, setResults] = createSignal<YoutubeSearchResult[]>([]);
  const [resultsOpen, setResultsOpen] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const roomData = useRouteData<Resource<RoomData>>();

  const onSubmit = async (searchText: string) => {
    if (!searchText) return;

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

      snackbar.success(`Lisätty jonoon ${htmlDecode(song.title)}`);
    } catch (error) {
      if (error instanceof Error) {
        snackbar.error(error.message);
      }
    }
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
          onSubmit={onSubmit}
          onChange={setText}
          onFocus={handleSearchFocus}
          loading={loading}
        />
      </div>
      <Show when={resultsOpen()}>
        <Result
          results={results}
          songs={roomData?.().songs || []}
          onAdd={handleAdd}
          onClose={() => setResultsOpen(false)}
          loading={loading}
        />
      </Show>
    </div>
  );
};

export default SearchComponent;
