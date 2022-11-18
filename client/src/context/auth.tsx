import {
  JSX,
  createContext,
  onMount,
  createSignal,
  Accessor,
  batch,
} from "solid-js";
import trpcClient from "trpc";
import { User } from "trpc/types";
import type { Component } from "solid-js";
import { UserLoginInput } from "trpc/types";
import { useNavigate } from "@solidjs/router";

type AuthStoreProps = {
  user: Accessor<User | null>;
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
  const navigate = useNavigate();

  const [authenticated, setAuthenticated] = createSignal<boolean>(false);
  const [user, setUser] = createSignal<User | null>(null);
  const [ready, setReady] = createSignal<boolean>(false);

  const fetchAndSetMe = async () => {
    try {
      const me = await trpcClient.user.me.query().then();

      batch(() => {
        setUser(me);
        setAuthenticated(true);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (token: UserLoginInput) => {
    try {
      await trpcClient.user.login.mutate(token);

      localStorage.setItem("token", token);
    } catch (err) {
      throw err;
    }
  };

  const register = async (name: string) => {
    try {
      const token = await trpcClient.user.register.mutate({ name });

      localStorage.setItem("token", token);

      window.location.reload();
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    const win: Window = window;
    win.location.reload();
  };

  onMount(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }

    if (token && !user()) {
      await fetchAndSetMe().catch(async () => {
        await login(token).catch(async () => {
          logout();
        });
      });
    }

    setReady(true);
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
