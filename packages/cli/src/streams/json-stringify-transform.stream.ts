import { Transform } from 'stream';
import { isObject } from '@agnoc/toolkit';
import type { TransformCallback } from 'stream';

export class JSONStringifyTransform extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  override _write(chunk: object, _: BufferEncoding, done: TransformCallback): void {
    this.push(JSON.stringify(chunk, filterProperties, 2));
    done();
  }
}

function filterProperties(_: string, value: unknown) {
  if (isObject(value) && value.type === 'Buffer') {
    return '[Buffer]';
  }

  return value;
}
