import { UserStateData } from "../handlers/UserState";
import Client from "../index";
import Channel from "./Channel";
// import Channel from "./Channel";
import TextMessage from "./TextMessage";

export default class User {
  session: number;
  name: string;
  mute: UserStateData["mute"] = false;
  deaf: UserStateData["deaf"] = false;
  suppress: UserStateData["suppress"] = false;
  selfMute: UserStateData["selfMute"] = false;
  selfDeaf: UserStateData["selfDeaf"] = false;
  texture: UserStateData["texture"];
  pluginContext: UserStateData["pluginContext"];
  pluginIdentity: UserStateData["pluginIdentity"];
  comment: UserStateData["comment"];
  hash: UserStateData["hash"];
  commentHash: UserStateData["commentHash"];
  textureHash: UserStateData["textureHash"];
  prioritySpeaker: UserStateData["prioritySpeaker"] = false;
  recording: UserStateData["recording"] = false;
  channel: Channel;
  client: Client;
  actor: User | undefined;
  userId: number | undefined;

  constructor(client: Client, data: UserStateData) {
    Object.defineProperty(this, "client", { value: client });

    this.session = data.session;
    this.client = client;
    this.name = data.name;
    this.hash = data.hash;

    const channel = this.client.channels.get(data.channelId ?? 0);
    if (!channel) {
      throw new Error("Channel not found");
    }

    this.channel = channel;

    this.setup(data);
  }

  setup(data: UserStateData) {
    this.session = data.session;
    this.name = data.name;
    this.hash = data.hash;

    if (data.mute !== undefined) {
      this.mute = data.mute;
    }
    if (data.deaf !== undefined) {
      this.deaf = data.deaf;
    }
    if (data.suppress !== undefined) {
      this.suppress = data.suppress;
    }
    if (data.selfMute !== undefined) {
      this.selfMute = data.selfMute;
    }
    if (data.selfDeaf !== undefined) {
      this.selfDeaf = data.selfDeaf;
    }
    if (data.texture !== undefined) {
      this.texture = data.texture;
    }
    if (data.pluginContext !== undefined) {
      this.pluginContext = data.pluginContext;
    }
    if (data.pluginIdentity !== undefined) {
      this.pluginIdentity = data.pluginIdentity;
    }
    if (data.comment !== undefined) {
      this.comment = data.comment;
    }

    if (data.commentHash !== undefined) {
      this.commentHash = data.commentHash;
    }
    if (data.textureHash !== undefined) {
      this.textureHash = data.textureHash;
    }
    if (data.prioritySpeaker !== undefined) {
      this.prioritySpeaker = data.prioritySpeaker;
    }
    if (data.recording !== undefined) {
      this.recording = data.recording;
    }

    if (data.actor) {
      this.actor = this.client.users.get(data.actor);
    }

    if (data.userId != undefined) {
      this.userId = data.userId;
    }

    const channel = this.client.channels.get(data.channelId ?? 0);
    if (!channel) {
      throw new Error("Channel not found");
    }
    this.channel = channel;

    if (data.actor != null) this.actor = this.client.users.get(data.actor);
  }

  sendMessage(message: string) {
    const textMessage = new TextMessage();
    textMessage.content = message;

    textMessage.users.set(this.session, this);

    return this.client.connection.writeProto(
      "TextMessage",
      textMessage.toPacket()
    );
  }
}
