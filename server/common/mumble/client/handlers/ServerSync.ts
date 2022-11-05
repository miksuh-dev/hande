import * as Util from "../Util";
import AbstractHandler from "./AbstractHandler";

export interface ServerSyncData {
  session: number;
  welcomeText: string;
  maxBandwidth: number;
}

export default class ServerSync extends AbstractHandler {
  override handle(data: ServerSyncData) {
    const info: { welcomeMessage?: string; maximumBitrate?: number } = {};

    this.client.user = this.client.users.get(data.session);
    info.welcomeMessage = data.welcomeText;
    info.maximumBitrate = data.maxBandwidth;

    const bitrate = Util.adjustNetworkBandwidth(data.maxBandwidth);
    this.client.connection.opusEncoder.setBitrate(bitrate);

    this.client.synced = true;

    /**
     * Emitted when the client is connected and ready
     * @event Client#ready
     * @param {ServerInfo} info The information from the server
     */
    this.client.emit("ready", this);
  }
}
