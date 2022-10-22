import User from "../structures/User";
import AbstractHandler from "./AbstractHandler";

export interface UserStateData {
  session: number;
  name: string;
  userId?: number;
  channelId?: number;
  hash: string;
  actor?: number;
  mute?: boolean;
  deaf?: boolean;
  suppress?: boolean;
  selfMute?: boolean;
  selfDeaf?: boolean;
  texture?: string;
  pluginContext?: string;
  pluginIdentity?: string;
  comment?: string;
  commentHash?: string;
  textureHash?: string;
  prioritySpeaker?: boolean;
  recording?: boolean;
  tempopraryAccessTokens?: string[];
  listeningChannelAdd?: number[];
  listeningChannelRemove?: number[];
}

export default class UserState extends AbstractHandler {
  override handle(data: UserStateData) {
    console.log("1231231", data);
    let user = this.client.users.get(data.session);

    if (user) {
      const oldUser = { ...user };
      user.setup(data);
      if (this.client.synced) this.client.emit("userChange", oldUser, user);
    } else {
      user = new User(this.client, data);
      if (this.client.synced) this.client.emit("userJoin", user);
    }
    this.client.users.set(user.session, user);
  }
}
