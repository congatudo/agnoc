import { Readable } from 'stream';

/** Convert a buffer to a readable stream. */
export function toStream(buffer: Buffer): Readable {
  return Readable.from(buffer, { objectMode: false });
}
