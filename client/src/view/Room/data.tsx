import { onMount, createResource, onCleanup, Signal } from "solid-js";
import { Room, RoomUpdateEvent } from "trpc/types";
import { createStore, reconcile, unwrap } from "solid-js/store";
import trpcClient from "trpc";
import useSnackbar from "hooks/useSnackbar";
import { RouteDataFuncArgs } from "@solidjs/router";

const handleUpdateEvent = (
  existingRoom: Room,
  event: RoomUpdateEvent
): Room => {
  if (!existingRoom) {
    return existingRoom;
  }

  if (event.user) {
    if (event.user.join) {
      existingRoom = {
        ...existingRoom,
        users: [...existingRoom.users, event.user.join],
      };
    }

    if (event.user.leave) {
      const userHash = event.user.leave;

      existingRoom = {
        ...existingRoom,
        users: existingRoom.users.filter((u) => u.hash !== userHash),
      };
    }
  }

  if (event.message) {
    if (event.message.add) {
      const message = event.message.add;

      existingRoom = {
        ...existingRoom,
        messages: [...existingRoom.messages, message],
      };
    }
  }

  if (event.song) {
    if (event.song.add) {
      const song = event.song.add;

      existingRoom = {
        ...existingRoom,
        songs: [...existingRoom.songs, song],
      };
    }

    if (event.song.remove) {
      const songId = event.song.remove;

      existingRoom = {
        ...existingRoom,
        songs: existingRoom.songs.filter((s) => s.id !== songId),
      };
    }

    if (event.song.skip) {
      const songId = event.song.skip;

      existingRoom = {
        ...existingRoom,
        playing:
          existingRoom.playing?.id === songId
            ? undefined
            : existingRoom.playing,
      };
    }

    if (event.song.setPlaying) {
      const song = event.song.setPlaying;

      existingRoom = {
        ...existingRoom,
        playing: song,
        songs: existingRoom.songs.filter((s) => s.id !== song.id),
      };
    }
  }

  return existingRoom;
};

function createDeepSignal<T>(value: T): Signal<T> {
  const [store, setStore] = createStore({
    value,
  });

  return [
    () => store.value,
    (v: T) => {
      const unwrapped = unwrap(store.value);
      typeof v === "function" && (v = v(unwrapped));
      setStore("value", reconcile(v));
      return store.value;
    },
  ] as Signal<T>;
}

function RoomData({ navigate }: RouteDataFuncArgs) {
  const snackbar = useSnackbar();

  const [room, { mutate }] = createResource<Room>(
    async () => trpcClient.room.get.query(),
    {
      storage: createDeepSignal,
      initialValue: {
        users: [],
        messages: [],
        songs: [],
        playing: undefined,
      },
    }
  );

  onMount(() => {
    const lobbyUpdate = trpcClient.room.onUpdate.subscribe(undefined, {
      onData(event) {
        mutate((existingRoom) => {
          if (!existingRoom) {
            return existingRoom;
          }

          const asd = handleUpdateEvent(existingRoom, event);

          return asd;
        });
      },
      onError(err) {
        snackbar.error(err.message);
        console.error("error", err);
      },
      onComplete() {
        snackbar.success("Poistuttiin huoneesta");
        navigate("/");
      },
    });

    onCleanup(() => {
      lobbyUpdate.unsubscribe();
    });
  });

  if (room.state === "errored") {
    throw room.error;
  }

  return room;
}

export default RoomData;
export type RoomData = ReturnType<typeof RoomData>;
