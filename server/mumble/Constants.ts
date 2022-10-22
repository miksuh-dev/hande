import { ClientOptions } from "./index";

export const Audio = {
  sampleRate: 48000,
  channels: 1,
  bitDepth: 8,
  frameSize: 480,
  frameLength: 10,
};

export const Network = {
  framesPerPacket: 1,
  quality: 20000,
};

/**
 * Options for a client
 */
export const DefaultOptions: ClientOptions = {
  url: "localhost",
  port: 64738,
  rejectUnauthorized: false,
  name: "NoodleTS",
  password: "",
  tokens: [],
};
