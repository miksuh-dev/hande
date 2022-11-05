import { Song } from "@prisma/client";
import { useRouteData } from "@solidjs/router";
import useSnackbar from "hooks/useSnackbar";
import { Component, Resource } from "solid-js";
import trpcClient from "trpc";
import { RoomData } from "../data";
import Playing from "./Playing";

const PlayingComponent: Component = () => {
  const roomData = useRouteData<Resource<RoomData>>();
  const snackbar = useSnackbar();

  const handleSkip = async (song: Song) => {
    try {
      await trpcClient.room.removeSong.mutate({
        id: song.id,
      });

      snackbar.success(`Ohitettiin kappale "${song.title}"`);
    } catch (error) {
      if (error instanceof Error) {
        snackbar.error(error.message);
      }
    }
  };

  if (!roomData) return null;
  return (
    <div class="flex-0 flex  flex-col overflow-hidden rounded-md bg-white">
      <div class="border-b border-gray-300 dark:border-neutral-700">
        <div class="inline-block rounded-t-lg p-4">Soi tällä hetkellä:</div>
      </div>
      <div class="overflow-hidden p-4">
        <Playing playing={roomData().playing} onSkip={handleSkip} />
      </div>
    </div>
  );
};

export default PlayingComponent;
