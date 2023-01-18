import { z } from "zod";

export const schemaForType =
  <T>() =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <S extends z.ZodType<T, any, unknown>>(arg: S) => {
    return arg;
  };
