import type { Readable } from 'stream';

/** Reads all data from a stream. */
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
