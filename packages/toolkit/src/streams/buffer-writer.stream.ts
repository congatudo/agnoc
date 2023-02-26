import { Writable } from 'stream';

export type Callback = (error?: Error | null) => void;

export class BufferWriter extends Writable {
  buffer: Buffer;

  constructor(buffer?: Buffer) {
    super({ objectMode: true });

    this.buffer = buffer || Buffer.alloc(0);
  }

  override _write(chunk: Buffer, _: BufferEncoding, done: Callback): void {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    done();
  }
}
