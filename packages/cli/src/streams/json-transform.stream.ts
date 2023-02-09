import { Transform, TransformCallback } from "stream";
import { ObjectLiteral } from "@agnoc/core/types/object-literal.type";

export class JSONTransform extends Transform {
  private buffer = "";

  constructor() {
    super({ objectMode: true });
  }

  override _transform(
    chunk: Buffer,
    _: BufferEncoding,
    done: TransformCallback
  ): void {
    this.buffer += chunk.toString("utf8");
    done();
  }

  override _flush(done: TransformCallback): void {
    let obj;

    try {
      obj = JSON.parse(this.buffer) as ObjectLiteral;
    } catch (e) {
      return done(e as Error);
    }

    this.push(obj);
    done();
  }
}
