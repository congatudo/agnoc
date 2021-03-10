import assert from "assert";
import { Readable } from "stream";

const ALLOWED_METHODS = [
  "readBigUInt64BE",
  "readBigUInt64LE",
  "readBigInt64BE",
  "readBigInt64LE",
  "readUInt8",
  "readUInt16LE",
  "readUInt16BE",
  "readUInt32LE",
  "readUInt32BE",
  "readInt8",
  "readInt16LE",
  "readInt16BE",
  "readInt32LE",
  "readInt32BE",
  "readFloatLE",
  "readFloatBE",
  "readDoubleLE",
  "readDoubleBE",
] as const;

type AllowedMethods = typeof ALLOWED_METHODS[number];

function readFn<M extends AllowedMethods>(size: number, method: M) {
  assert(ALLOWED_METHODS.includes(method), "readFn invalid method");

  return function read(stream: Readable): ReturnType<Buffer[M]> {
    const buffer = stream.read(size) as Buffer | null;

    assert(buffer, `read(${size}): empty value from stream`);

    // eslint-disable-next-line security/detect-object-injection
    return buffer[method]() as ReturnType<Buffer[M]>;
  };
}

export const readByte = readFn(1, "readUInt8");
export const readShort = readFn(2, "readUInt16LE");
export const readWord = readFn(4, "readUInt32LE");
export const readFloat = readFn(4, "readFloatLE");
export const readLong = readFn(8, "readBigUInt64LE");

export function readString(stream: Readable): string {
  const length = readByte(stream);

  if (length) {
    const str = stream.read(length) as Buffer | null;

    assert(str, `read(${length}): empty value from stream`);

    return str.toString("utf8");
  }

  return "";
}
