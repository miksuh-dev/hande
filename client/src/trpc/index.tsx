import { httpBatchLink } from "@trpc/client";
import { splitLink } from "@trpc/client/links/splitLink";
import { createTRPCProxyClient } from "@trpc/client";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink";
import type { AppRouter } from "../../../server/router";
import env from "../config";

const getAuthToken = () => localStorage.getItem("token") || "";

const getWsUrl = () => {
  const token = getAuthToken();
  if (!token) {
    return `${env.WEBSOCKET_URL}`;
  }

  return `${env.WEBSOCKET_URL}?token=${token}`;
};

export const wsClient = createWSClient({
  url: getWsUrl(),
});

const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    splitLink({
      condition(op) {
        return op.type === "subscription";
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: env.API_URL,
        headers() {
          return {
            Authorization: "Bearer " + getAuthToken(),
          };
        },
      }),
    }),
  ],
});

export default trpcClient;
