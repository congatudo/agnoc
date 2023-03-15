import { Transform } from 'stream';
import type { TransformCallback } from 'stream';

export class StringTransform extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  override _write(chunk: { toString(): string }, _: BufferEncoding, done: TransformCallback): void {
    this.push(chunk.toString() + '\n');
    done();
  }
}
