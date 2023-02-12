import { Transform } from 'stream';
import { Packet } from '@agnoc/core';
import type { PacketSerialized, OPDecoderLiteral } from '@agnoc/core';
import type { TransformCallback } from 'stream';

export class PacketEncodeTransform extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  override _transform(array: PacketSerialized<OPDecoderLiteral>[], _: BufferEncoding, done: TransformCallback): void {
    array.forEach((serialized) => {
      this.push(Packet.fromJSON(serialized).toBuffer());
    });
    done();
  }
}
