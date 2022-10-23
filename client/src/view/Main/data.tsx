import { RouteDataFuncArgs, useNavigate } from "@solidjs/router";
import useAuth from "hooks/useAuth";
import useSnackbar from "hooks/useSnackbar";

async function TokenData({ location }: RouteDataFuncArgs) {
  const auth = useAuth();
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const handleLogin = async (token: string) => {
    try {
      await auth.action.login(token);

      navigate("/room");
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(err.message);
      }
    }
  };

  const getTokenFromStorage = () => {
    return localStorage.getItem("token");
  };

  const getTokenFromUrl = () => {
    return new URLSearchParams(location.search).get("token");
  };

  const token = getTokenFromStorage() || getTokenFromUrl();

  if (!token) {
    navigate("/");

    return;
  }

  return handleLogin(token);
}

export default TokenData;
