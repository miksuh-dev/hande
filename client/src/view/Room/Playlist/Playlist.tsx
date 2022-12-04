import Tooltip from "components/Tooltip";
import { Component, For } from "solid-js";
import { Song } from "trpc/types";
import { htmlDecode } from "utils/parse";

type Props = {
  onSkip: (song: Song) => void;
  songs?: Song[];
};

const PlaylistComponent: Component<Props> = (props) => {
  return (
    <div class="max-h-full space-y-4 overflow-y-auto rounded-md pr-4">
      <For each={props.songs}>
        {(song) => (
          <div class="flex flex-row items-center justify-between border border-neutral-200 p-4 shadow-md dark:border-neutral-700 dark:bg-neutral-800">
            <div class="flex flex-row space-x-8">
              <div class="flex items-center">
                <img class="w-42 h-32 " src={song.thumbnail} alt="" />
              </div>
              <div class="flex flex-col">
                <h1>{htmlDecode(song.title)}</h1>
                <p>Toivoja: {song.requester}</p>
              </div>
            </div>

            <div class="pr-2">
              <Tooltip text={"Poista kappale jonosta"}>
                <button onClick={() => props.onSkip(song)} class="icon-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </Tooltip>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default PlaylistComponent;
