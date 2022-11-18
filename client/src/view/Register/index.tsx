import useAuth from "hooks/useAuth";
import useSnackbar from "hooks/useSnackbar";
import { Component, createSignal } from "solid-js";

const RegisterView: Component = () => {
  const auth = useAuth();
  const snackbar = useSnackbar();
  const [username, setUsername] = createSignal<string>("");

  const onSubmit = async (name: string) => {
    try {
      auth.action.register(name);
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(err.message);
      }
    }
  };

  return (
    <div class="flex h-full  flex-col items-center justify-center ">
      <div class="w-[400px] space-y-8">
        <h1 class="text-center text-6xl font-extrabold tracking-tight text-custom-primary-900 backdrop-blur backdrop-filter dark:text-white">
          Syötä nimimerkki:
        </h1>
        <form
          class="flex  flex-col space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(username());
          }}
        >
          <input
            class="rounded-md border-2 border-custom-primary-900 p-2 dark:border-white"
            type="text"
            id="username"
            value={username()}
            onInput={(e) => setUsername(e.currentTarget.value)}
          />
          <button
            type="submit"
            class="mt-2 rounded-md bg-custom-primary-900 p-2 text-white dark:bg-white dark:text-custom-primary-900"
          >
            Jatka
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterView;
