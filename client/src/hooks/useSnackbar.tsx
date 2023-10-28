import { useContext } from "solid-js";
import { SnackbarContext } from "context/snackbar";

const useSnackbar = () => {
  const context = useContext(SnackbarContext);

  const success = (message: string) => {
    context.show(message, "success");
  };

  const error = (message: string) => {
    context.show(message, "error");
  };

  return {
    success,
    error,
  };
};

export default useSnackbar;
