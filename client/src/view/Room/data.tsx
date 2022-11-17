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
      return {
        ...existingRoom,
        users: [...existingRoom.users, event.user.join],
      };
    }

    if (event.user.leave) {
      const userHash = event.user.leave;

      return {
        ...existingRoom,
        users: existingRoom.users.filter((u) => u.hash !== userHash),
      };
    }
  }

  if (event.message) {
    if (event.message.add) {
      const message = event.message.add;

      return {
        ...existingRoom,
        messages: [...existingRoom.messages, message],
      };
    }
  }

  if (event.song) {
    if (event.song.add) {
      const song = event.song.add;

      return {
        ...existingRoom,
        songs: [...existingRoom.songs, song],
      };
    }

    if (event.song.remove) {
      const songId = event.song.remove;

      return {
        ...existingRoom,
        songs: existingRoom.songs.filter((s) => s.id !== songId),
      };
    }

    if ("setPlaying" in event.song) {
      const song = event.song.setPlaying;

      if (!song) {
        return { ...existingRoom, playing: undefined };
      }

      return {
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
    // eslint-disable-next-line solid/reactivity
    () => store.value,
    // eslint-disable-next-line solid/reactivity
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
    () => trpcClient.room.get.query(),
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

  onMount(async () => {
    let timeout: NodeJS.Timeout;

    const pongListen = trpcClient.room.onPong.subscribe(undefined, {
      onData: (message) => {
        console.log(message);
        timeout = setTimeout(async () => {
          trpcClient.room.ping.mutate();
        }, 1000 * 30);
      },
    });

    onCleanup(() => {
      pongListen.unsubscribe();
      clearTimeout(timeout);
    });

    await trpcClient.room.ping.mutate();
  });

  onMount(() => {
    const lobbyUpdate = trpcClient.room.onUpdate.subscribe(undefined, {
      onData(event) {
        mutate((existingRoom) => {
          if (!existingRoom) {
            return existingRoom;
          }

          return handleUpdateEvent(existingRoom, event);
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

  return room;
}

export default RoomData;
export type RoomData = ReturnType<typeof RoomData>;
