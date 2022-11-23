import { Outlet, useNavigate } from "@solidjs/router";
import Loading from "components/Loading";
import useAuth from "hooks/useAuth";
import { Component, createEffect, Show } from "solid-js";

const AuthGate: Component = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  createEffect(() => {
    if (auth.ready()) {
      if (!auth.authenticated() || !auth.user()) {
        return navigate("/main");
      }

      if (auth.user().isGuest) {
        return navigate("/room/guest");
      }
    }
  });

  return (
    <Show
      when={auth.ready() && auth.authenticated() && auth.user()}
      fallback={<Loading />}
    >
      <Outlet />
    </Show>
  );
};

export default AuthGate;
