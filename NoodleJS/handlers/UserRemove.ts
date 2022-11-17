import AbstractHandler from "./AbstractHandler";

export default class UserRemove extends AbstractHandler {
  handle(data: any) {
    let user = this.client.users.get(data.session);

    if (user) {
      this.client.users.delete(user.session);
      if (this.client.synced) this.client.emit("userDisconnect", user);
    }
  }
}
