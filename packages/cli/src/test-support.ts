import type { JSONPacket } from './streams/packet-encode-transform.stream';
import type { Readable } from 'stream';

export function readStream<T>(stream: Readable): Promise<T[]>;
export function readStream(stream: Readable, encoding: BufferEncoding): Promise<string[]>;
export function readStream<T>(stream: Readable, encoding?: BufferEncoding): Promise<(T | string)[]> {
  if (encoding) {
    stream.setEncoding(encoding);
  }

  return new Promise((resolve, reject) => {
    const data: unknown[] = [];

    stream.on('data', (chunk) => data.push(chunk));
    stream.on('end', () => resolve(data as T[]));
    stream.on('error', (error) => reject(error));
  });
}

export function givenAJSONPacket(): JSONPacket<'DEVICE_GETTIME_RSP'> {
  return {
    ctype: 1,
    flow: 0,
    deviceId: 2,
    userId: 3,
    sequence: '7a479a0fbb978c12',
    payload: {
      opcode: 'DEVICE_GETTIME_RSP',
      object: {
        result: 1,
        body: {
          deviceTime: 2,
        },
      },
    },
  };
}
