import { useContext } from "solid-js";
import { AuthContext } from "context/auth";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
