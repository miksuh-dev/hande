import {
  onMount,
  createResource,
  onCleanup,
  Signal,
  createSignal,
} from "solid-js";
import { Room, RoomUpdateEvent, SongClient } from "trpc/types";
import { createStore, reconcile, unwrap } from "solid-js/store";
import trpcClient from "trpc";
import useSnackbar from "hooks/useSnackbar";
import useAuth from "hooks/useAuth";
import { generateId } from "utils/auth";
import useTheme from "hooks/useTheme";
import { useI18n } from "@solid-primitives/i18n";
import { DateTime } from "luxon";
import { TRPCClientError } from "@trpc/client";
import { MumbleUser } from "@server/types/auth";

const playListCompare = (a: SongClient, b: SongClient) => {
  if (a.position !== b.position) {
    return a.position - b.position;
  }

  return a.createdAt > b.createdAt ? 1 : -1;
};

const handleUpdateEvent = (
  existingRoom: Room,
  event: RoomUpdateEvent
): Room => {
  if (!existingRoom) {
    return existingRoom;
  }

  if (event.user) {
    if (event.user.join) {
      const user = event.user.join;

      if (existingRoom.users.some((u) => u.hash === user.hash)) {
        return existingRoom;
      }

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

    if (event.user.update) {
      const updatedUser = event.user.update;

      if (!updatedUser) {
        return existingRoom;
      }

      return {
        ...existingRoom,
        users: existingRoom.users.map((u) =>
          u.hash === updatedUser.hash ? updatedUser : u
        ),
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

  if (event.room) {
    return {
      ...existingRoom,
      room: {
        ...existingRoom.room,
        ...event.room,
      },
    };
  }

  if (event.song) {
    if (event.song.add) {
      const songs = event.song.add;

      return {
        ...existingRoom,
        songs: [...existingRoom.songs, ...songs],
      };
    }

    if (event.song.remove) {
      const songIds = event.song.remove;

      return {
        ...existingRoom,
        songs: existingRoom.songs.filter((s) => !songIds.includes(s.id)),
      };
    }

    if (event.song.update) {
      if (!event.song.update?.length) {
        return existingRoom;
      }

      const updatedSongs = event.song.update.map((song) => {
        const existingSong = existingRoom.songs.find(
          (existingSong) => existingSong.id === song.id
        );

        return existingSong ? { ...existingSong, ...song } : song;
      });

      const songs = existingRoom.songs
        .filter((s) => !updatedSongs.some((us) => us.id === s.id))
        .concat(updatedSongs)
        .sort(playListCompare);

      return {
        ...existingRoom,
        songs,
      };
    }

    if ("setPlaying" in event.song) {
      const song = event.song.setPlaying;

      if (!song) {
        return { ...existingRoom, playing: undefined };
      }

      if (song.contentId === existingRoom.playing?.contentId) {
        return {
          ...existingRoom,
          playing: { ...existingRoom.playing, ...song },
        };
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

function RoomData() {
  const [t] = useI18n();

  const snackbar = useSnackbar();
  const auth = useAuth();
  const theme = useTheme();
  const [reconnecting, setReconnecting] = createSignal(false);
  const [error, setError] = createSignal<
    { title: string; description: string } | undefined
  >();

  const [room, { mutate }] = createResource<Room>(
    () => trpcClient.room.get.query(),
    {
      storage: createDeepSignal,
      initialValue: {
        users: [],
        messages: [],
        songs: [],
        playing: undefined,
        sources: [],
        room: {
          autoplay: undefined,
        },
        version: "0.0.0",
      },
    }
  );

  onMount(() => {
    const user = auth.user();

    if (user) {
      initRoomSocket(user);
    }
  });

  const onPingError = (err: Error, onClose: () => void) => {
    if (err instanceof TRPCClientError) {
      const message = t(err.message);

      if (message) {
        setError({
          title: message,
          description: t("common.refreshPage"),
        });

        onClose();
      }

      return;
    }

    console.error(err);
    snackbar.error(t("error.common", { error: err.message }));
  };

  const initRoomSocket = (user: MumbleUser) => {
    const session = {
      clientId: generateId(user),
      joined: DateTime.utc().toISO(),
      version: room().version,
    };

    let timeout: NodeJS.Timeout;

    const pongListen = trpcClient.room.onPong.subscribe(
      { clientId: session.clientId },
      {
        onStarted: () => {
          setReconnecting(false);
        },
        onData: (message) => {
          console.log(message);
          timeout = setTimeout(async () => {
            trpcClient.room.ping
              .mutate(session)
              .catch((err) => onPingError(err, onClose));
          }, 1000 * 30);
        },
        onError: () => {
          setReconnecting(true);

          // Retry connection
          initRoomSocket(user);
        },
      }
    );

    trpcClient.room.ping
      .mutate(session)
      .catch((err) => onPingError(err, onClose));

    const lobbyUpdate = trpcClient.room.onUpdate.subscribe(
      { clientId: session.clientId, state: { theme: theme.current() } },
      {
        onData(event) {
          mutate((existingRoom) => {
            if (!existingRoom) {
              return existingRoom;
            }

            return handleUpdateEvent(existingRoom, event);
          });
        },
      }
    );

    const onClose = () => {
      lobbyUpdate.unsubscribe();
      pongListen.unsubscribe();
      clearTimeout(timeout);
    };

    onCleanup(() => {
      onClose();
    });
  };

  return { room, reconnecting, error };
}

interface Ready<T> {
  state: "ready";
  loading: false;
  error: undefined;
  latest: T;
  (): T;
}

export default RoomData;
export type RoomData = Ready<ReturnType<typeof RoomData>>;
