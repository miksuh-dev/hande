import { RouteDataFuncArgs } from "@solidjs/router";
import env from "config";

function TokenData({}: RouteDataFuncArgs) {
  const getTokenFromUrl = () => {
    return new URLSearchParams(location.search).get("login");
  };

  const loginToken = getTokenFromUrl();

  if (loginToken) {
    localStorage.setItem("token", loginToken);

    // Hard refresh to make sure socket connection is established
    window.location.href = env.BASE_PATH;
  }
}

export default TokenData;
