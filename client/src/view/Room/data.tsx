import { onMount, createResource, onCleanup, Signal } from "solid-js";
import { Room } from "trpc/types";
import { createStore, reconcile, unwrap } from "solid-js/store";
import trpcClient from "trpc";
import useSnackbar from "hooks/useSnackbar";
import { RouteDataFuncArgs } from "@solidjs/router";

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
    () => trpcClient.room.get.query(),
    {
      storage: createDeepSignal,
    }
  );

  onMount(() => {
    const lobbyUpdate = trpcClient.room.onUpdate.subscribe(undefined, {
      onData(updatedLobby) {
        mutate((existingLobby) => {
          console.log("updatedLobby", updatedLobby);
          if (!existingLobby) return existingLobby;

          const messages = existingLobby.messages.concat(
            updatedLobby.messages || []
          );

          return {
            ...existingLobby,
            ...updatedLobby,
            messages,
          };
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
