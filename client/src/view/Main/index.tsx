import { useNavigate } from "@solidjs/router";
import { CrownIcon } from "components/common/icon";
import useAuth from "hooks/useAuth";
import { Component, createEffect } from "solid-js";

const MainView: Component = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  createEffect(() => {
    if (!auth.user()) {
      return;
    }

    if (auth.user().isGuest) {
      return navigate("/room/guest");
    }

    return navigate("/room");
  });

  return (
    <div class="flex h-full items-center justify-center">
      <h1 class="text-center text-7xl font-extrabold tracking-tight text-custom-primary-900 backdrop-blur backdrop-filter dark:text-white md:text-9xl">
        <CrownIcon />
        Hande
      </h1>
    </div>
  );
};

export default MainView;
