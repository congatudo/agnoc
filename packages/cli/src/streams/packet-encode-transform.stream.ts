import { Transform, TransformCallback } from 'stream';
import { PacketSerialized, OPDecoderLiteral, Packet } from '@agnoc/core';

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
