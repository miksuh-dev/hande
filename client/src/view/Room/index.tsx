import { Component, createSignal, Show } from "solid-js";
import Content from "components/Content";
import List from "./List";
import Social from "./Social";
import Search from "./Search";
import Loading from "components/Loading";
import { useRouteData } from "@solidjs/router";
import { RoomData } from "./data";
import { useI18n } from "@solid-primitives/i18n";
import Footer from "view/Room/Footer";
import Video from "view/Room/Video";

const RoomView: Component = () => {
  const [t] = useI18n();
  const { reconnecting } = useRouteData<RoomData>();
  const [showVideo, setShowVideo] = createSignal(false);
  const [showSocial, setSocialOpen] = createSignal(false);

  return (
    <Show
      when={reconnecting()}
      fallback={
        <Content
          footer={
            <Footer
              showVideo={showVideo}
              setShowVideo={setShowVideo}
              showSocial={showSocial}
              setShowSocial={setSocialOpen}
            />
          }
        >
          <div class="flex flex-col h-full w-full">
            <div class="relative flex flex-1 flex-col overflow-hidden p-4 dark:text-neutral-100  xl:flex-row xl:space-x-4 xl:space-y-0">
              <div class="z-10 flex h-1 flex-1 flex-col space-y-4 xl:h-full">
                <Search />
                <Show when={showVideo()}>
                  <Video />
                </Show>
                <List />
              </div>
              <Social showSocial={showSocial} setShowSocial={setSocialOpen} />
            </div>
          </div>
        </Content>
      }
    >
      <Content>
        <Loading title={t("error.socketReconnecting")} />
      </Content>
    </Show>
  );
};

export default RoomView;
