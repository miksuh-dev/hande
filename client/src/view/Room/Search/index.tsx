import { Component, createEffect, createSignal, Show } from "solid-js";
import trpcClient from "trpc";
import Result from "./Result";
import Search from "./Search";
import {
  SearchResult,
  SearchResultPlaylist,
  SearchResultRadio,
  SearchResultSong,
} from "trpc/types";
import useSnackbar from "hooks/useSnackbar";
import { htmlDecode } from "utils/parse";
import { RoomData } from "../data";
import { useRouteData } from "@solidjs/router";
import trackClickOutside from "utils/trackClickOutside";
import { Source } from "trpc/types";
import { useI18n } from "@solid-primitives/i18n";
import PlaylistViewDialog from "components/PlaylistViewDialog";
import { hasSearchChanged } from "./utils";

export interface SearchTerms {
  text: string;
  source: string;
}

const SearchComponent: Component = () => {
  const [t] = useI18n();

  const { room } = useRouteData<RoomData>();

  const snackbar = useSnackbar();
  const [text, setText] = createSignal("");
  const [results, setResults] = createSignal<SearchResult[]>([]);
  const [resultsOpen, setResultsOpen] = createSignal(false);
  const [lastSearch, setLastSearch] = createSignal<SearchTerms>();

  const [selectedPlaylist, setSelectedPlaylist] = createSignal<
    SearchResultPlaylist | undefined
  >();

  const [source, setSource] = createSignal<Source>();
  const [loading, setLoading] = createSignal(false);

  createEffect(() => {
    if (!source() && room().sources.length > 0) {
      setSource(room().sources[0]);
    }
  });

  const onSearch = async (
    searchText: string,
    selectedSource: Source | undefined
  ) => {
    if (!searchText || !selectedSource) return;

    const searchTerms = {
      text: searchText,
      source: selectedSource.value,
    };

    if (!hasSearchChanged(lastSearch(), searchTerms)) {
      setResultsOpen(true);
      return;
    }

    try {
      setLoading(true);
      setResultsOpen(true);

      const suggestions = await trpcClient.room.search.query(searchTerms);

      setLastSearch(searchTerms);

      setResults(suggestions);
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(t("error.common", { error: err.message }));
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

  const handleAdd = async (
    result: SearchResultSong[] | SearchResultRadio[]
  ) => {
    try {
      const songs = await trpcClient.room.addSong.mutate(
        result.map((r) => ({
          contentId: r.contentId,
          url: r.url,
          title: r.title,
          thumbnail: r.thumbnail ?? null,
          type: r.type,
        }))
      );

      if (songs.length > 1) {
        snackbar.success(
          t(`snackbar.source.song.addedManyToQueue`, {
            count: songs.length.toString(),
          })
        );
      } else if (songs[0]) {
        const song = songs[0];

        snackbar.success(
          t(`snackbar.source.${song.type}.addedToQueue`, {
            item: htmlDecode(song.title),
          })
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        snackbar.error(t("snackbar.error", { error: error.message }));
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
          sources={room().sources}
          onSearch={onSearch}
          onSourceChange={handleSourceChange}
          onTextChange={setText}
          onFocus={handleSearchFocus}
          loading={loading}
        />
      </div>
      <Show when={resultsOpen()}>
        <Result
          results={results}
          songs={room().songs}
          playing={room().playing}
          onAdd={handleAdd}
          onPlaylistView={(playlistId) => setSelectedPlaylist(playlistId)}
          onClose={() => setResultsOpen(false)}
          loading={loading}
        />
      </Show>
      <Show when={selectedPlaylist()}>
        {(playlist) => (
          <PlaylistViewDialog
            playlist={playlist}
            playing={room().playing}
            songs={room().songs}
            onSongAdd={handleAdd}
            onClose={() => setSelectedPlaylist(undefined)}
          />
        )}
      </Show>
    </div>
  );
};

export default SearchComponent;
