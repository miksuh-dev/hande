import { MumbleUser } from "@server/types/auth";

// Generate somewhat unique id to differientiate same user's different sessions
export const generateId = (user: MumbleUser) => {
  return `${user.hash}-${Math.random().toString(36).substring(2, 9)}`;
};
