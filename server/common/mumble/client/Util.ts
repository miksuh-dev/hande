/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as Constants from "./Constants";

export const toVarint = (i: number): { value: Buffer; length: number } => {
  const arr = [];
  if (i < 0) {
    i = ~i;
    if (i <= 0x3) {
      // return Buffer.from([0xfc | i]);
      const buffer = Buffer.from([0xfc | i]);
      return { value: buffer, length: buffer.length };
    }

    arr.push(0xf8);
  }

  if (i < 0x80) {
    arr.push(i);
  } else if (i < 0x4000) {
    arr.push((i >> 8) | 0x80);
    arr.push(i & 0xff);
  } else if (i < 0x200000) {
    arr.push((i >> 16) | 0xc0);
    arr.push((i >> 8) & 0xff);
    arr.push(i & 0xff);
  } else if (i < 0x10000000) {
    arr.push((i >> 24) | 0xe0);
    arr.push((i >> 16) & 0xff);
    arr.push((i >> 8) & 0xff);
    arr.push(i & 0xff);
  } else if (i < 0x100000000) {
    arr.push(0xf0);
    arr.push((i >> 24) & 0xff);
    arr.push((i >> 16) & 0xff);
    arr.push((i >> 8) & 0xff);
    arr.push(i & 0xff);
  } else {
    throw new TypeError(`Non-integer values are not supported. (${i}`);
  }

  return {
    value: Buffer.from(arr),
    length: arr.length,
  };
};

export const fromVarInt = (buf: Buffer) => {
  // TODO: 111110__ + varint	Negative recursive varint
  // TODO: 111111xx       	Byte-inverted negative two bit number (~xx)

  const retVal = {
    value: 0,
    consumed: 0,
  };

  if (buf[0]! < 0x80) {
    // 0xxxxxxx            7 bit positive number
    retVal.value = buf[0]!;
    retVal.consumed = 1;
  } else if (buf[0]! < 0xc0) {
    // 10xxxxxx + 1 byte   14-bit positive number
    retVal.value = (buf[0]! & 0x3f) << 8;
    retVal.value |= buf[1]!;
    retVal.consumed = 2;
  } else if (buf[0]! < 0xe0) {
    // 110xxxxx + 2 bytes  21-bit positive number
    retVal.value = (buf[0]! & 0x1f) << 16;
    retVal.value |= buf[1]! << 8;
    retVal.value |= buf[2]!;
    retVal.consumed = 3;
  } else if (buf[0]! < 0xf0) {
    // 1110xxxx + 3 bytes  28-bit positive number
    retVal.value = (buf[0]! & 0x0f) << 24;
    retVal.value |= buf[1]! << 16;
    retVal.value |= buf[2]! << 8;
    retVal.value |= buf[3]!;
    retVal.consumed = 4;
  } else if (buf[0]! < 0xf4) {
    // 111100__ + int (32-bit)
    retVal.value = buf[1]! << 24;
    retVal.value |= buf[2]! << 16;
    retVal.value |= buf[3]! << 8;
    retVal.value |= buf[4]!;
    retVal.consumed = 5;
  } else if (buf[0]! < 0xfc) {
    // 111101__ + long (64-bit)
    retVal.value = buf[1]! << 56;
    retVal.value |= buf[2]! << 48;
    retVal.value |= buf[3]! << 40;
    retVal.value |= buf[4]! << 32;
    retVal.value |= buf[5]! << 24;
    retVal.value |= buf[6]! << 16;
    retVal.value |= buf[7]! << 8;
    retVal.value |= buf[8]!;
    retVal.consumed = 9;
  }

  return retVal;
};

export const encodeVersion = (major: number, minor: number, patch: number) => {
  return ((major & 0xffff) << 16) | ((minor & 0xff) << 8) | (patch & 0xff);
};

export const adjustNetworkBandwidth = (bitspersec: number) => {
  const frames = Constants.Network.framesPerPacket;
  let bitrate = Constants.Network.quality;

  if (getNetworkBandwidth(bitrate, frames) > bitspersec) {
    while (
      bitrate > 8000 &&
      getNetworkBandwidth(bitrate, frames) > bitspersec
    ) {
      bitrate -= 1000;
    }
  }

  return bitrate;
};

export const getNetworkBandwidth = (bitrate: number, frames: number) => {
  let overhead = 20 + 8 + 4 + 1 + 2 + frames + 12;
  overhead *= 800 / frames;
  const asd = overhead + bitrate;

  return asd;
};
