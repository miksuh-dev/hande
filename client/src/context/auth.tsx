import { JSX, createContext, onMount, createSignal, Accessor } from "solid-js";
import trpcClient from "trpc";
import { User } from "trpc/types";
import type { Component } from "solid-js";
import { UserLoginInput } from "trpc/types";
import { useNavigate } from "@solidjs/router";
import env from "config";

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

  const login = async (token: UserLoginInput) => {
    try {
      const user: User = await trpcClient.user.login.mutate(token);

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
    window.location.href = `${env.BASE_PATH}`;
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
      console.log("err", err);

      localStorage.removeItem("token");
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
