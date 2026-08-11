import { Transform, TransformCallback } from 'stream';
import { OPDecoderLiteral } from '@congatudo/core/constants/opcodes.constant';
import { Packet, PacketSerialized } from '@congatudo/core/value-objects/packet.value-object';

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
