import { Transform, TransformCallback } from "stream";
import {
  Packet,
  PacketSerialized,
} from "@agnoc/core/value-objects/packet.value-object";
import { OPDecoderLiteral } from "@agnoc/core/constants/opcodes.constant";

export class PacketEncodeTransform extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(
    array: PacketSerialized<OPDecoderLiteral>[],
    _: BufferEncoding,
    done: TransformCallback
  ): void {
    array.forEach((serialized) => {
      this.push(Packet.fromJSON(serialized).toBuffer());
    });
    done();
  }
}
