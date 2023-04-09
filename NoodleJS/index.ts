import { EventEmitter } from "events";
import Promise from "bluebird";
import Connection from "./Connection";
import * as Constants from "./Constants";
import ChannelRemove from "./handlers/ChannelRemove";
import ChannelState from "./handlers/ChannelState";
import ServerSync from "./handlers/ServerSync";
import TextMessage from "./handlers/TextMessage";
import UserRemove from "./handlers/UserRemove";
import UserState from "./handlers/UserState";
import Collection from "./structures/Collection";
import User from "./structures/User";
import Util from "./Util";
import Dispatcher from "./voice/Dispatcher";

export interface ClientOptions {
  url: string;
  port: number;
  rejectUnauthorized: boolean;
  name: string;
  password: string;
  key?: Buffer;
  cert?: Buffer;
  tokens: string[];
}

/**
 * The main class for interacting with the Mumble server
 * @extends EventEmitter
 */
export default class Client extends EventEmitter {
  options: ClientOptions;
  connection: Connection;
  channels: Collection;
  users: Collection;
  voiceConnection: Dispatcher;
  ping: ReturnType<typeof setInterval> | undefined;
  user: User | undefined;
  synced = false;

  /**
   * @param  {ClientOptions} [options] Options for the client
   */
  constructor(options: Partial<ClientOptions> = {}) {
    super();

    /**
     * The options the client is instantiated with
     * @type {ClientOptions}
     */
    this.options = Util.mergeDefault(Constants.DefaultOptions, options);

    /**
     * The connection to the Mumble server
     * @type {Connection}
     * @private
     */
    this.connection = new Connection(this.options);
    this.connection.on("error", (error: any) => {
      this.emit("error", error);
    });

    this.connection.on("connected", () => {
      this.connection.writeProto("Version", {
        version: Util.encodeVersion(1, 2, 0),
        release: "NoodleJS Extended Client",
        os: "NodeJS",
        os_version: process.version,
      });
      this.connection.writeProto("Authenticate", {
        username: this.options.name,
        password: this.options.password,
        opus: true,
        tokens: this.options.tokens,
      });
      this._pingRoutine();
    });

    /**
     * All of the {@link Channel} objects that are synced with the server,
     * mapped by their IDs
     * @type {Collection<id, Channel>}
     */
    this.channels = new Collection();

    /**
     * All of the {@link User} objects that are synced with the server,
     * mapped by their sessions
     * @type {Collection<session, User>}
     */
    this.users = new Collection();

    /**
     * The {@link Dispatcher} for the voiceConnection
     * @type {Dispatcher}
     */
    this.voiceConnection = new Dispatcher(this);

    const serverSync = new ServerSync(this);
    const userState = new UserState(this);
    const userRemove = new UserRemove(this);
    const channelState = new ChannelState(this);
    const channelRemove = new ChannelRemove(this);
    const textMessage = new TextMessage(this);

    this.connection.on("ServerSync", (data: any) => serverSync.handle(data));
    this.connection.on("UserState", (data: any) => {
      userState.handle(data);

      if (data.name === this.options.name) {
        this.user = this.users.get(data.session);
      }
    });
    this.connection.on("UserRemove", (data: any) => userRemove.handle(data));
    this.connection.on("ChannelRemove", (data: any) =>
      channelRemove.handle(data)
    );
    this.connection.on("ChannelState", (data: any) =>
      channelState.handle(data)
    );
    // this.connection.on('CryptSetup', data => console.log(data))
    this.connection.on("TextMessage", (data: any) => textMessage.handle(data));

    this.connection.on("voiceData", (voiceData: any) => {
      this.emit("voiceData", voiceData);
    });
  }

  /**
   * The ping routine for the client to keep the connection alive
   * @private
   */
  _pingRoutine() {
    this.ping = setInterval(() => {
      this.connection.writeProto("Ping", { timestamp: Date.now() });
    }, 15000);
  }

  connect() {
    return this.connection.connect();
  }

  /**
   * Sends a message to the {@link Channel} where the client is currently
   * connected
   * @param  {String} message   The message to be sent
   * @param  {Boolean} recursive If the message should be sent down the tree
   * @return {Promise<TextMessage>}
   */
  sendMessage(message: string, recursive: boolean) {
    return this.user?.channel?.sendMessage(message, recursive);
  }

  /**
   * Switches to another channel
   * @param  {Number} id         The id of the channel to switch to
   * @return {Promise<any>}
   */
  switchChannel(id: number) {
    if (!this.user?.session) {
      return Promise.reject("User not initialized");
    }

    if (this.channels.has(id)) {
      return this.connection.writeProto("UserState", {
        session: this.user.session,
        actor: this.user.session,
        channelId: id,
      });
    } else {
      return Promise.reject("ChannelId unknown");
    }
  }

  /**
   * Starts listening to another channel without joining it
   * @param  {Number} id         The id of the channel to start listening to
   * @return {Promise<any>}
   */
  startListeningToChannel(id: number) {
    if (!this.user?.session) {
      return Promise.reject("User not initialized");
    }

    if (this.channels.has(id)) {
      return this.connection.writeProto("UserState", {
        session: this.user.session,
        listeningChannelAdd: [id],
      });
    } else {
      return Promise.reject("ChannelId unknown");
    }
  }

  /**
   * Stops listening to another channel
   * @param  {Number} id         The id of the channel to stop listening to
   * @return {Promise<any>}
   */
  stopListeningToChannel(id: number) {
    if (!this.user?.session) {
      return Promise.reject("User not initialized");
    }

    if (this.channels.has(id)) {
      return this.connection.writeProto("UserState", {
        session: this.user.session,
        listeningChannelRemove: [id],
      });
    } else {
      return Promise.reject("ChannelId unknown");
    }
  }

  /**
   * Set up a voiceTarget to be optionally used when sending voice data
   * @param  {Number} targetId       The id for this voiceTarget. Must be between 4 and 30
   * @param  {Array.<Number>} userIds  Array of user sessions to send to. Can be empty.
   * @param  {Number} channelId      ChannelId to send to. Ignored when userIds is not empty.
   * @return {Promise<any>}
   */
  setupVoiceTarget(targetId: number, userIds: number[], channelId: number) {
    if (targetId < 4 || targetId > 30) {
      return Promise.reject("targetId must be between 3 and 30");
    }

    if (userIds.length) {
      for (const idx of userIds) {
        if (!this.users.has(userIds[idx])) {
          return Promise.reject(`userId ${userIds[idx]} unknown`);
        }
      }
      return this.connection.writeProto("VoiceTarget", {
        id: targetId,
        targets: [{ session: userIds }],
      });
    } else {
      if (!this.channels.has(channelId)) {
        return Promise.reject("ChannelId unknown");
      }
      return this.connection.writeProto("VoiceTarget", {
        id: targetId,
        targets: [{ channelId: channelId }],
      });
    }
  }

  mute() {
    if (!this.user?.session) {
      return Promise.reject("User not initialized");
    }

    return this.connection.writeProto("UserState", {
      session: this.user.session,
      actor: this.user.session,
      selfMute: true,
    });
  }

  unmute() {
    if (!this.user?.session) {
      return Promise.reject("User not initialized");
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
