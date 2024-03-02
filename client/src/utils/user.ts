import { IncomingMessage } from "../trpc/types";

export const isSystemMessage = ({
  property,
}: {
  property: IncomingMessage["property"];
}): boolean => {
  return "isSystem" in property && property.isSystem;
};

export const isMumbleUser = ({
  property,
}: {
  property: IncomingMessage["property"];
}): boolean => {
  return "isMumbleUser" in property && property.isMumbleUser;
};
