import assert from 'assert';
import type { Readable, Writable } from 'stream';

const ALLOWED_READ_METHODS = [
  'readBigInt64BE',
  'readBigInt64LE',
  'readBigUInt64BE',
  'readBigUInt64LE',
  'readDoubleBE',
  'readDoubleLE',
  'readFloatBE',
  'readFloatLE',
  'readInt16BE',
  'readInt16LE',
  'readInt32BE',
  'readInt32LE',
  'readInt8',
  'readUInt16BE',
  'readUInt16LE',
  'readUInt32BE',
  'readUInt32LE',
  'readUInt8',
] as const;

const ALLOWED_WRITE_METHODS = [
  'writeBigInt64BE',
  'writeBigInt64LE',
  'writeBigUInt64BE',
  'writeBigUInt64LE',
  'writeDoubleBE',
  'writeDoubleLE',
  'writeFloatBE',
  'writeFloatLE',
  'writeInt16BE',
  'writeInt16LE',
  'writeInt32BE',
  'writeInt32LE',
  'writeInt8',
  'writeUInt16BE',
  'writeUInt16LE',
  'writeUInt32BE',
  'writeUInt32LE',
  'writeUInt8',
] as const;

type AllowedReadMethods = (typeof ALLOWED_READ_METHODS)[number];
type AllowedWriteMethods = (typeof ALLOWED_WRITE_METHODS)[number];

function readFn<M extends AllowedReadMethods>(size: number, method: M) {
  assert(ALLOWED_READ_METHODS.includes(method), 'readFn invalid method');

  return function read(stream: Readable): ReturnType<Buffer[M]> {
    const buffer = stream.read(size) as Buffer | null;

    assert(buffer, `read(${size}): empty value from stream`);

    return buffer[method]() as ReturnType<Buffer[M]>;
  };
}

function writeFn<M extends AllowedWriteMethods>(size: number, method: M) {
  assert(ALLOWED_WRITE_METHODS.includes(method), 'writeFn invalid method');

  type Value = Parameters<Buffer[M]>[0];

  return function write(stream: Writable, value: Value): void {
    const buffer = Buffer.alloc(size);

    (buffer[method] as (value: Value) => void)(value);

    stream.write(buffer);
  };
}

export const readByte = readFn(1, 'readUInt8');
export const readShort = readFn(2, 'readUInt16LE');
export const readWord = readFn(4, 'readUInt32LE');
export const readFloat = readFn(4, 'readFloatLE');
export const readLong = readFn(8, 'readBigUInt64LE');

export const writeByte = writeFn(1, 'writeUInt8');
export const writeShort = writeFn(2, 'writeUInt16LE');
export const writeWord = writeFn(4, 'writeUInt32LE');
export const writeFloat = writeFn(4, 'writeFloatLE');
export const writeLong = writeFn(8, 'writeBigUInt64LE');

export function readString(stream: Readable): string {
  const length = readByte(stream);

  if (length) {
    const str = stream.read(length) as Buffer | null;

    assert(str, `read(${length}): empty value from stream`);

    return str.toString('utf8');
  }

  return '';
}

export function writeString(stream: Writable, value: string): void {
  writeByte(stream, value.length);

  const buffer = Buffer.from(value, 'utf8');

  stream.write(buffer);
}
