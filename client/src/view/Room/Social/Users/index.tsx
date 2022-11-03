import type { Component } from "solid-js";
import { Show, For } from "solid-js";
import { User } from "trpc/types";

type Props = {
  users: User[];
};

const RoomUsers: Component<Props> = (props) => {
  return (
    <div class="flex-1 overflow-x-auto bg-white">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden ">
          <table class="min-w-full table-fixed divide-y-2 divide-gray-200 dark:divide-gray-700">
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              <Show
                when={props.users.length}
                fallback={
                  <td class="whitespace-nowrap py-2 px-2 text-sm font-medium text-gray-900 dark:text-white">
                    Ei paikalla olevia käyttäjiä
                  </td>
                }
              >
                <For each={props.users}>
                  {(user) => (
                    <tr>
                      <td class="whitespace-nowrap py-2 px-2 text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </td>
                    </tr>
                  )}
                </For>
              </Show>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoomUsers;
