import { Readable } from "stream";

export function toStream(buffer: Buffer): Readable {
  return Readable.from(buffer, { objectMode: false });
}
