import useAuth from "hooks/useAuth";
import useSnackbar from "hooks/useSnackbar";
import { Component, createSignal, Show } from "solid-js";
import { UserRegisterInput } from "trpc/types";
import { handleError } from "utils/error";

const RegisterView: Component = () => {
  const auth = useAuth();
  const snackbar = useSnackbar();
  const [username, setUsername] = createSignal<string>("");
  const [error, setError] = createSignal<Partial<UserRegisterInput>>();

  const onSubmit = async (name: string) => {
    try {
      await auth.action.register(name);
    } catch (err) {
      const formattedError = handleError(err);

      if (formattedError) {
        return setError(formattedError);
      }

      if (err instanceof Error) {
        snackbar.error(err.message);
      }
    }
  };

  return (
    <div class="flex h-full flex-col items-center justify-center p-4">
      <div class="w-full max-w-[400px] space-y-8">
        <h1 class="text-center text-5xl font-extrabold tracking-tight text-custom-primary-900 backdrop-blur backdrop-filter dark:text-white sm:text-6xl">
          Syötä nimimerkki:
        </h1>
        <form
          class="flex  flex-col space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(username());
          }}
        >
          <div>
            <input
              class="w-full rounded-md border-2 border-custom-primary-900 p-2 dark:border-white"
              type="text"
              id="username"
              value={username()}
              onInput={(e) => setUsername(e.currentTarget.value)}
            />
            <Show when={error()?.name}>
              <p class="mt-2 text-sm text-red-600 dark:text-red-500">
                <span class="font-medium">{error()?.name}</span>
              </p>
            </Show>
          </div>
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
