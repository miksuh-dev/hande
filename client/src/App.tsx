import { Component, Show } from "solid-js";
import { lazy, Suspense } from "solid-js";
import { Routes, Route, Navigate } from "@solidjs/router";

import useAuth from "hooks/useAuth";
import roomData from "view/Room/data";
import tokenData from "view/Token/data";
import AuthGate from "auth/AuthGate";
import Loading from "components/Loading";

const MainView = lazy(() => import("view/Main"));
const RoomView = lazy(() => import("view/Room"));
const GuestLoginView = lazy(() => import("view/GuestLogin"));

const App: Component = () => {
  const auth = useAuth();

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Show when={auth.ready()} fallback={<Loading />}>
          <Route path="/room" element={<AuthGate />}>
            <Route path="/" component={RoomView} data={roomData} />
            <Route path="/guest" component={GuestLoginView} />
          </Route>
          <Route path="/main" component={MainView} />
          <Route path="/" element={<Navigate href={"/main"} />} />
        </Show>
        <Route path="/token" component={Loading} data={tokenData} />
      </Routes>
    </Suspense>
  );
};

export default App;
