import { Transform, TransformCallback } from "stream";

export class JSONTransform extends Transform {
  private buffer = "";

  constructor() {
    super({ objectMode: true });
  }

  _transform(chunk: Buffer, _: BufferEncoding, done: TransformCallback): void {
    this.buffer += chunk.toString("utf8");
    done();
  }

  _flush(done: TransformCallback): void {
    let obj;

    try {
      obj = JSON.parse(this.buffer) as Record<string, unknown>;
    } catch (e) {
      return done(e);
    }

    this.push(obj);
    done();
  }
}
