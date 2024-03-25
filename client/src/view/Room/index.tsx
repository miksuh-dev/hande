import { Component, createSignal, Match, Show, Switch } from "solid-js";
import Content from "components/Content";
import List from "./List";
import Social from "./Social";
import Search from "./Search";
import Loading from "components/Loading";
import Error from "components/Error";
import { useRouteData } from "@solidjs/router";
import { RoomData } from "./data";
import { useI18n } from "@solid-primitives/i18n";
import Footer from "view/Room/Footer";
import Video from "view/Room/Video";
import Lyrics from "view/Room/Lyrics";
import { LyricsItem, SongType } from "trpc/types";

const RoomView: Component = () => {
  const [t] = useI18n();
  const { room } = useRouteData<RoomData>();
  const { reconnecting, error } = useRouteData<RoomData>();
  const [showVideo, setShowVideo] = createSignal(false);
  const [lyrics, setLyrics] = createSignal<LyricsItem | undefined>(undefined);
  const [showSocial, setSocialOpen] = createSignal(false);

  return (
    <Switch>
      <Match when={reconnecting()}>
        <Content>
          <Loading title={t("error.socketReconnecting")} />
        </Content>
      </Match>
      <Match when={error()}>
        {(text) => (
          <Content>
            <Error title={text().title} description={text().description} />
          </Content>
        )}
      </Match>
      <Match when={true}>
        <Content
          footer={
            <Footer
              showVideo={showVideo}
              setShowVideo={setShowVideo}
              showSocial={showSocial}
              setShowSocial={setSocialOpen}
              setLyrics={setLyrics}
              lyrics={lyrics}
            />
          }
        >
          <div class="flex flex-col h-full w-full">
            <div class="relative flex flex-1 flex-col overflow-hidden p-4 dark:text-neutral-100  xl:flex-row xl:space-x-4 xl:space-y-0">
              <div class="z-10 flex h-1 flex-1 flex-col space-y-4 xl:h-full">
                <Search />
                <Show
                  when={
                    (showVideo() || lyrics()) &&
                    room()?.playing?.type === SongType.SONG
                  }
                >
                  <div class="flex flex-row space-x-4 h-[50%]">
                    <Show when={showVideo()}>
                      <div
                        class="flex-1 flex flex-col p-4 rounded-md bg-white dark:bg-neutral-900"
                        classList={{
                          "max-w-[50%]": !!lyrics(),
                        }}
                      >
                        <Video playing={room()?.playing} />
                      </div>
                    </Show>
                    <Show when={lyrics()}>
                      {(songLyrics) => (
                        <div
                          class="flex-1 flex flex-col p-4 rounded-md bg-white dark:bg-neutral-900"
                          classList={{
                            "max-w-[50%]": showVideo(),
                          }}
                        >
                          <Lyrics lyrics={songLyrics} />
                        </div>
                      )}
                    </Show>
                  </div>
                </Show>
                <List />
              </div>
              <Social showSocial={showSocial} setShowSocial={setSocialOpen} />
            </div>
          </div>
        </Content>
      </Match>
    </Switch>
  );
};

export default RoomView;
