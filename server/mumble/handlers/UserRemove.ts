import AbstractHandler from "./AbstractHandler";

export interface UserRemoveData {
  session: number;
}

export default class UserRemove extends AbstractHandler {
  override handle(data: UserRemoveData) {
    const user = this.client.users.get(data.session);

    if (user) {
      this.client.users.delete(user.session);
      if (this.client.synced) this.client.emit("userDisconnect", user);
    }
  }
}
