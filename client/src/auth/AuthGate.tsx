import { useI18n } from "@solid-primitives/i18n";
import { Outlet, useNavigate } from "@solidjs/router";
import Loading from "components/Loading";
import useAuth from "hooks/useAuth";
import useSnackbar from "hooks/useSnackbar";
import { Component, createEffect, Show } from "solid-js";

const AuthGate: Component = () => {
  const [t] = useI18n();

  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const auth = useAuth();

  createEffect(() => {
    if (auth.ready()) {
      const user = auth.user();

      if (!auth.authenticated() || !user) {
        snackbar.error(t("error.notLoggedIn"));
        return navigate("/main");
      }

      if (user.property.isGuest) {
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
