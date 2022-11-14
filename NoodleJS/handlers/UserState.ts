import AbstractHandler from "./AbstractHandler";
import User from "../structures/User";
import Util from "../Util";

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
