import { TRPCClientError } from "@trpc/client";

export const handleError = (error: unknown) => {
  if (error instanceof TRPCClientError) {
    const formattedError = error.data?.formattedError;
    if (formattedError) {
      return formattedError;
    }
  }

  console.error("error.issues", error);
};
