import { useRouteData } from "@solidjs/router";
import useSnackbar from "hooks/useSnackbar";
import { Component, Resource } from "solid-js";
import trpcClient from "trpc";
import { Song } from "trpc/types";
import type { RoomData } from "../data";
import Playlist from "./Playlist";

const PlaylistComponent: Component = () => {
  const roomData = useRouteData<Resource<RoomData>>();

  const snackbar = useSnackbar();

  const handleSkip = async (song: Song) => {
    try {
      await trpcClient.room.removeSong.mutate({
        id: song.id,
      });

      snackbar.success(`Kappale "${song.title}" poistettu jonosta`);
    } catch (error) {
      if (error instanceof Error) {
        snackbar.error(error.message);
      }
    }
  };

  if (!roomData) return null;
  return (
    <div class="flex h-1 flex-1 flex-col overflow-hidden rounded-md bg-white xl:h-full">
      <div class="border-b border-gray-300 dark:border-neutral-700">
        <div class="inline-block rounded-t-lg p-4">Seuraavana vuorossa:</div>
      </div>
      <div class="overflow-hidden p-4 pr-0">
        <Playlist songs={roomData().songs} onSkip={handleSkip} />
      </div>
    </div>
  );
};

export default PlaylistComponent;
