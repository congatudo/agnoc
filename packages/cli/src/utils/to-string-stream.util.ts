import { OPDecoderLiteral } from "@agnoc/core/constants/opcodes.constant";
import { Packet } from "@agnoc/core/value-objects/packet.value-object";
import { Transform } from "stream";

export function toStringStream(): Transform[] {
  return [
    new Transform({
      objectMode: true,
      transform(packet: Packet<OPDecoderLiteral>, _, done) {
        this.push(packet.toString() + "\n");
        done();
      },
    }),
  ];
}
