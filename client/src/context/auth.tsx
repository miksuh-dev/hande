import { JSX, createContext, onMount, createSignal, Accessor } from "solid-js";
import trpcClient from "trpc";
import { TRPCClientError } from "@trpc/client";
import type { Component } from "solid-js";
import { UserLoginInput } from "trpc/types";
import env from "config";
import useSnackbar from "hooks/useSnackbar";
import { useI18n } from "@solid-primitives/i18n";
import { MumbleUser } from "@server/types/auth";

type AuthStoreProps = {
  user: Accessor<MumbleUser | null>;
  authenticated: Accessor<boolean>;
  ready: Accessor<boolean>;
};

interface AuthContextProps extends AuthStoreProps {
  action: {
    login: (data: UserLoginInput) => Promise<void>;
    register: (name: string) => Promise<void>;
    logout: () => void;
  };
}

const INITIAL_VALUE = {
  authenticated: () => false,
  user: () => null,
  ready: () => false,
  action: {
    login: async () => {},
    register: async () => {},
    logout: () => {},
  },
};

export const AuthContext = createContext<AuthContextProps>(INITIAL_VALUE);

export const AuthProvider: Component<{
  children: JSX.Element;
}> = (props) => {
  const [t] = useI18n();

  const snackbar = useSnackbar();
  const [authenticated, setAuthenticated] = createSignal<boolean>(false);
  const [user, setUser] = createSignal<MumbleUser | null>(null);
  const [ready, setReady] = createSignal<boolean>(false);

  const login = async (token: UserLoginInput) => {
    try {
      const user = await trpcClient.user.login.mutate(token);

      localStorage.setItem("token", token);

      setAuthenticated(true);
      setUser(user);
    } catch (err) {
      throw err;
    }
  };

  const register = async (name: string) => {
    try {
      const token = await trpcClient.user.register.mutate({ name });

      localStorage.setItem("token", token);
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    // Hard refresh to clear socket connection
    window.location.href = `${env.BASE_PATH}/`;
  };

  const getTokenFromStorage = () => {
    return localStorage.getItem("token");
  };

  onMount(async () => {
    const token = getTokenFromStorage();

    try {
      if (token) {
        await login(token);
      }
    } catch (err) {
      if (err instanceof TRPCClientError && err.data?.code === "UNAUTHORIZED") {
        localStorage.removeItem("token");
      }

      if (err instanceof Error) {
        snackbar.error(t("error.common", { error: t(err.message) }));
      }
    } finally {
      setReady(true);
    }
  });

  const value = {
    user,
    authenticated,
    ready,
    action: {
      login,
      register,
      logout,
    },
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};
