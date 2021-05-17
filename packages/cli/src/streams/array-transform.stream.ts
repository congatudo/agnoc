import { Transform, TransformCallback } from "stream";

export class ArrayTransform<T> extends Transform {
  private list: T[] = [];

  constructor() {
    super({ objectMode: true });
  }

  override _write(chunk: T, _: BufferEncoding, done: TransformCallback): void {
    this.list.push(chunk);
    done();
  }

  override _final(done: TransformCallback): void {
    this.push(this.list);
    done();
  }
}
