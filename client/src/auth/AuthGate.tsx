import { Outlet, useNavigate } from "@solidjs/router";
import Loading from "components/Loading";
import useAuth from "hooks/useAuth";
import useSnackbar from "hooks/useSnackbar";
import { Component, createEffect, Show } from "solid-js";

const AuthGate: Component = () => {
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const auth = useAuth();

  createEffect(() => {
    if (auth.ready()) {
      if (!auth.authenticated() || !auth.user()) {
        snackbar.error("Et ole kirjautunut sisään");
        return navigate("/main");
      }

      if (auth.user().isGuest) {
        return navigate("/room/guest");
      }

      return navigate("/room");
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
