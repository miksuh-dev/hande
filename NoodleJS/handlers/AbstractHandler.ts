import Client from "../index"

export default class AbstractHandler {
  client: Client
  constructor(client: Client) {
    this.client = client
  }

  handle(data: any) {
    return data
  }
}
