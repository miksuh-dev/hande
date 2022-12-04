import Tooltip from "components/Tooltip";
import { Component, Show } from "solid-js";
import { Song, PlayingSong } from "trpc/types";
import { htmlDecode } from "utils/parse";
import Progress from "./Progress";

type Props = {
  playing: PlayingSong | undefined;
  onSkip: (song: Song) => void;
};

const PlayingComponent: Component<Props> = (props) => {
  return (
    <div class="flex max-h-full min-h-[160px] items-center">
      <Show
        when={props.playing}
        fallback={
          <div class="flex-1 flex-col justify-center text-center">
            <h5 class="text-xl">Tällä hetkellä ei soi mitään</h5>
            <p>Lisää uusia kappaleita jonoon aloittaaksesi toiston</p>
          </div>
        }
        keyd
      >
        {(song) => (
          <div class="w-full space-y-2">
            <div class="flex flex-row items-center justify-between">
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
                <Tooltip text={"Ohita kappale"}>
                  <button
                    onClick={() => props.onSkip(song)}
                    class="icon-button"
                  >
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 16l7-6-7-6m8 12l7-6-7-6"
                      />
                    </svg>
                  </button>
                </Tooltip>
              </div>
            </div>
            <Progress playing={song} />
          </div>
        )}
      </Show>
    </div>
  );
};

export default PlayingComponent;
