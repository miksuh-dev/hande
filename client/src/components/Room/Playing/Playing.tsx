import { Song } from "@prisma/client";
import { Component, Show } from "solid-js";
import { RoomData } from "../index";

type Props = {
  roomData: RoomData;
  onSkip: (song: Song) => void;
};

const PlayingComponent: Component<Props> = (props) => {
  return (
    <div class="max-h-full">
      <Show when={props.roomData()?.playing} keyd>
        {(song) => (
          <div class="flex flex-row items-center justify-between">
            <div class="flex flex-row space-x-8">
              <div class="flex items-center">
                <img class="w-42 h-32 " src={song.thumbnail} alt="" />
              </div>
              <div class="flex flex-col">
                <h1>{song.title}</h1>
                <p>Toivoja: {song.requester}</p>
              </div>
            </div>
            <div class="pr-2">
              <button
                onClick={() => props.onSkip(song)}
                class="flex rounded-md  py-2 px-2 font-bold text-black hover:text-red-600"
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
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
};

export default PlayingComponent;
