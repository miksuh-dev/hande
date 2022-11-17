import User from "../structures/User";
import Util from "../Util";
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
  handle(data: any) {
    let user = this.client.users.get(data.session);

    if (user) {
      const oldUser = Util.cloneObject(user);
      user.setup(data);
      if (this.client.synced) this.client.emit("userChange", oldUser, user);
    } else {
      user = new User(this.client, data);
      if (this.client.synced) this.client.emit("userJoin", user);
    }
    this.client.users.set(user.session, user);
  }
}
