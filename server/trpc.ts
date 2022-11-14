import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError, ZodIssue, ZodIssueCode } from "zod";
import { Context } from "./context";

const getZodErrorMessages = (error: ZodIssue) => {
  switch (error.code) {
    case ZodIssueCode.invalid_type:
      return error.message;
    case ZodIssueCode.invalid_literal:
      return error.message;
    case ZodIssueCode.custom:
      return error.message;
    case ZodIssueCode.invalid_union:
      return error.message;
    case ZodIssueCode.invalid_union_discriminator:
      return error.message;
    case ZodIssueCode.invalid_enum_value:
      return error.message;
    case ZodIssueCode.unrecognized_keys:
      return error.message;
    case ZodIssueCode.invalid_arguments:
      return error.message;
    case ZodIssueCode.invalid_return_type:
      return error.message;
    case ZodIssueCode.invalid_date:
      return error.message;
    case ZodIssueCode.invalid_string:
      return error.message;
    case ZodIssueCode.too_small:
      return "Pakollinen kenttä";
    case ZodIssueCode.too_big:
      return error.message;
    case ZodIssueCode.invalid_intersection_types:
      return error.message;
    case ZodIssueCode.not_multiple_of:
      return error.message;
  }
};

const formatError = (error: TRPCError) => {
  if (error.cause instanceof ZodError) {
    return error.cause.issues.reduce<Record<string, string>>(
      (acc, curr) => ({
        ...acc,
        [curr.path.join(".")]: getZodErrorMessages(curr),
      }),
      {}
    );
  }

  return { general: error.message };
};

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        formattedError: formatError(error),
      },
    };
  },
});
