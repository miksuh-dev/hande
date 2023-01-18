export interface MumbleUser {
  name: string;
  session: number;
  hash: string;
  version: number;
  property: {
    isGuest: boolean;
    isMumbleUser: boolean;
  };
}

export interface OnlineUser extends MumbleUser {
  state: {
    isVideoOn?: boolean;
    theme?: string;
  };
}
