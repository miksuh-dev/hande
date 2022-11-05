import { EventEmitter } from "events";
import Connection from "./Connection";
import * as Constants from "./Constants";
import ChannelRemove, { ChannelRemoveData } from "./handlers/ChannelRemove";
import ChannelState, { ChannelStateData } from "./handlers/ChannelState";
import ServerSync, { ServerSyncData } from "./handlers/ServerSync";
import TextMessage, { TextMessageData } from "./handlers/TextMessage";
import UserRemove, { UserRemoveData } from "./handlers/UserRemove";
import UserState, { UserStateData } from "./handlers/UserState";
import Channel from "./structures/Channel";
import User from "./structures/User";
import * as Util from "./Util";
import Dispatcher from "./voice/Dispatcher";

export interface ClientOptions {
  url: string;
  port: number;
  rejectUnauthorized: boolean;
  name: string;
  password: string;
  tokens: string[];
}

/**
 * The main class for interacting with the Mumble server
 * @extends EventEmitter
 */
export default class Client extends EventEmitter {
  options: ClientOptions;
  connection: Connection;
  channels: Map<number, Channel>;
  users: Map<number, User>;
  voiceConnection: Dispatcher;
  ping: ReturnType<typeof setInterval> | undefined;
  user: User | undefined;
  synced: boolean;

  constructor(options = {}) {
    super();

    /**
     * The options the client is instantiated with
     * @type {ClientOptions}
     */
    this.options = {
      ...Constants.DefaultOptions,
      ...options,
    };

    /**
     * The connection to the Mumble server
     * @type {Connection}
     * @private
     */
    this.connection = new Connection(this.options);
    this.connection.on("error", (error) => {
      console.log("error", error);
      this.emit("error", error);
    });

    this.connection.on("connected", () => {
      this.connection
        .writeProto("Version", {
          version: Util.encodeVersion(1, 0, 0),
          release: "NoodleTS Client",
          os: "NodeJS",
          os_version: process.version,
        })
        .catch((error) => {
          this.emit("error", error);
        });
      this.connection
        .writeProto("Authenticate", {
          username: this.options.name,
          password: this.options.password,
          opus: true,
          tokens: this.options.tokens,
        })
        .catch((error) => {
          console.log("error", error);
          this.emit("error", error);
        });
      this._pingRoutine();
    });

    /**
     * All of the {@link Channel} objects that are synced with the server,
     * mapped by their IDs
     * @type {Collection<id, Channel>}
     */
    this.channels = new Map();

    /**
     * All of the {@link User} objects that are synced with the server,
     * mapped by their sessions
     * @type {Collection<session, User>}
     */
    this.users = new Map();

    /**
     * The {@link Dispatcher} for the voiceConnection
     * @type {Dispatcher}
     */
    this.voiceConnection = new Dispatcher(this);

    this.synced = false;

    const serverSync = new ServerSync(this);
    const userState = new UserState(this);
    const userRemove = new UserRemove(this);
    const channelState = new ChannelState(this);
    const channelRemove = new ChannelRemove(this);
    const textMessage = new TextMessage(this);

    // TODO This is not ran for some reason
    this.connection.on("ServerSync", (data: ServerSyncData) => {
      console.log("serversync");
      serverSync.handle(data);
    });

    this.connection.on("UserState", (data: UserStateData) => {
      userState.handle(data);

      // First UserState is own
      if (!this.user || data.name !== this.connection.options.name) {
        this.user = this.users.get(data.session);

        // TODO: temp solution to set ready stea as serverSync is not sent
        this.emit("ready", this);
        this.synced = true;
      }
    });

    this.connection.on("UserRemove", (data: UserRemoveData) =>
      userRemove.handle(data)
    );

    this.connection.on("ChannelRemove", (data: ChannelRemoveData) => {
      console.log("channelRemoveData", data);
      channelRemove.handle(data);
    });

    this.connection.on("ChannelState", (data: ChannelStateData) =>
      channelState.handle(data)
    );
    // this.connection.on("PermissionQuery", (data: any) => {
    //   console.log("permissionQuery", data);
    //   // channelState.handle(data)
    // });
    // this.connection.on("CryptSetup", (data) => console.log(data));

    this.connection.on("TextMessage", (data: TextMessageData) => {
      // console.log("textMessage123", textMessage);
      textMessage.handle(data);
    });

    this.connection.on("voiceData", (voiceData) => {
      this.emit("voiceData", voiceData);
    });
  }

  /**
   * The ping routine for the client to keep the connection alive
   */
  _pingRoutine() {
    this.ping = setInterval(() => {
      this.connection
        .writeProto("Ping", { timestamp: Date.now() })
        .catch((error) => {
          this.emit("error", error);
        });
    }, 15000);
  }

  connect() {
    this.connection.connect();
  }

  /**
   * Sends a message to the {@link Channel} where the client is currently
   * connected
   */
  sendMessage(message: string, recursive: boolean) {
    if (!this.user) {
      throw new Error("Client user not yet initialized");
    }

    return this.user.channel.sendMessage(message, recursive);
  }

  /**
   * Switches to another channel
   */
  switchChannel(id: number) {
    if (!this.user) {
      throw new Error("Client user not yet initialized");
    }

    if (!this.channels.has(id)) {
      throw new Error("Channel does not exist");
    }

    return this.connection.writeProto("UserState", {
      session: this.user.session,
      actor: this.user.session,
      channelId: id,
    });
  }

  /**
   * Starts listening to another channel without joining it
   */
  startListeningToChannel(id: number) {
    if (!this.user) {
      throw new Error("Client user not yet initialized");
    }

    if (!this.channels.has(id)) {
      throw new Error("ChannelId unknown");
    }

    return this.connection.writeProto("UserState", {
      session: this.user.session,
      listeningChannelAdd: [id],
    });
  }

  /**
   * Stops listening to another channel
   */
  stopListeningToChannel(id: number) {
    if (!this.user) {
      throw new Error("Client user not yet initialized");
    }

    if (!this.channels.has(id)) {
      throw new Error("ChannelId unknown");
    }

    return this.connection.writeProto("UserState", {
      session: this.user.session,
      listeningChannelRemove: [id],
    });
  }

  /**
   * Set up a voiceTarget to be optionally used when sending voice data
   */
  setupVoiceTarget(targetId: number, userIds: number[], channelId: number) {
    if (targetId < 4 || targetId > 30) {
      return Promise.reject("targetId must be between 3 and 30");
    }

    if (userIds.length) {
      const missingId = userIds.find((idx) => {
        // TODO Used to be return !this.users.has(userIds[idx]);
        return !this.users.has(idx);
      });

      if (missingId) {
        throw new Error(`userId  ${missingId} unknown`);
      }

      return this.connection.writeProto("VoiceTarget", {
        id: targetId,
        targets: [{ session: userIds }],
      });
    }

    if (!this.channels.has(channelId)) {
      throw new Error("ChannelId unknown");
    }

    return this.connection.writeProto("VoiceTarget", {
      id: targetId,
      targets: [{ channelId: channelId }],
    });
  }

  mute() {
    if (!this.user) {
      throw new Error("Client user not yet initialized");
    }

    return this.connection.writeProto("UserState", {
      session: this.user.session,
      actor: this.user.session,
      selfMute: true,
    });
  }

  unmute() {
    if (!this.user) {
      throw new Error("Client user not yet initialized");
    }

    return this.connection.writeProto("UserState", {
      session: this.user.session,
      actor: this.user.session,
      selfMute: false,
    });
  }

  destroy() {
    try {
      clearInterval(this.ping);
      this.connection.close();
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
