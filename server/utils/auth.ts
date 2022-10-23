import { IncomingMessage } from "http";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MumbleUser } from "types/auth";

const getTokenFromHeader = (headers: IncomingMessage["headers"]) => {
  const authorization = headers.authorization;
  if (!authorization) {
    return null;
  }

  const token = authorization.replace("Bearer ", "");
  return token;
};

export const getTokenFromUrl = (url: string) => {
  const token = url.replace("/?token=", "");
  if (!token) return null;

  return token;
};

export const getUserFromRequest = (
  headers: IncomingMessage["headers"],
  url: string
) => {
  const token = getTokenFromHeader(headers) ?? getTokenFromUrl(url);
  if (!token) return null;

  try {
    const user = verifyJWTToken(token);

    return user;
  } catch (err) {
    return null;
  }
};

export const verifyJWTToken = (token: string) => {
  const authSecret = process.env.AUTH_TOKEN_SECRET;
  if (!authSecret) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No token data",
    });
  }

  try {
    const user = jwt.verify(token, authSecret) as MumbleUser | undefined;

    return user;
  } catch (err) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid token",
    });
  }
};

export const createSession = (userData: MumbleUser) => {
  const authSecret = process.env.AUTH_TOKEN_SECRET;
  if (!authSecret) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No token data",
    });
  }

  const token = jwt.sign(userData, authSecret, {
    expiresIn: "15d",
  });

  return token;
};

export const hashPassword = async (plaintextPassword: string) => {
  const saltRounds = 10;

  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(plaintextPassword, salt);
};

export const comparePassword = (plaintextPassword: string, hash: string) => {
  return bcrypt.compare(plaintextPassword, hash);
};
