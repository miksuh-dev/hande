export interface MumbleUser {
  name: string;
  session: number;
  hash: string;
  isGuest: boolean;
  isMumbleUser: boolean;
  theme?: string;
}
