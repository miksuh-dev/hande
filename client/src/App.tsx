import { Component /* , ErrorBoundary */, Show } from "solid-js";
import { lazy, Suspense } from "solid-js";
import { Routes, Route } from "@solidjs/router";

import useAuth from "hooks/useAuth";
import mainData from "view/Main/data";
import roomData from "view/Room/data";

const Loading = lazy(() => import("components/Loading"));
const MainView = lazy(() => import("view/Main"));
const RoomView = lazy(() => import("view/Room"));

const App: Component = () => {
  const auth = useAuth();

  return (
    <Suspense fallback={<Loading />}>
      <Show when={auth.ready()} fallback={<Loading />}>
        <Routes>
          <Show when={auth.authenticated()}>
            <Route path="/room" component={RoomView} data={roomData} />
          </Show>
          <Route path="/" component={MainView} data={mainData} />
        </Routes>
      </Show>
    </Suspense>
  );
};

export default App;
