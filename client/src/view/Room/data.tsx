import {
  onMount,
  createResource,
  createSignal,
  onCleanup,
  Signal,
} from "solid-js";
import { IncomingMessage, Room } from "trpc/types";
import { createStore, reconcile, unwrap } from "solid-js/store";
import trpcClient from "trpc";
import useSnackbar from "hooks/useSnackbar";

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

function RoomData() {
  const snackbar = useSnackbar();

  const [room] = createResource<Room>(async () => trpcClient.room.get.query(), {
    storage: createDeepSignal,
  });

  const [messages, setMessages] = createSignal<IncomingMessage[]>([]);

  // onMount(() => {
  //   const lobbyId = Number(params.id);
  //   if (!lobbyId) throw new Error("Lobby not found");
  //
  //   const lobbyUpdate = trpcClient.room.onUpdate.subscribe(
  //     { lobbyId },
  //     {
  //       onData(updatedLobby) {
  //         mutate((existingLobby) => {
  //           if (!existingLobby) return existingLobby;
  //
  //           return {
  //             ...existingLobby,
  //             ...updatedLobby,
  //           };
  //         });
  //       },
  //       onError(err) {
  //         snackbar.error(err.message);
  //         console.error("error", err);
  //       },
  //       onComplete() {
  //         snackbar.success("Poistuttiin huoneesta");
  //         navigate("/lobby/list");
  //       },
  //     }
  //   );

  //   onCleanup(() => {
  //     lobbyUpdate.unsubscribe();
  //   });
  // });

  onMount(() => {
    const lobbyUpdate = trpcClient.room.onMessage.subscribe(undefined, {
      onData(message) {
        setMessages((messages) => [...messages, message]);
      },
      onError(err) {
        snackbar.error(err.message);
      },
    });

    onCleanup(() => {
      lobbyUpdate.unsubscribe();
    });
  });

  return { room, messages };
}

export default RoomData;
