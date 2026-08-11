import { Transform } from 'stream';
import { OPDecoderLiteral } from '@congatudo/core/constants/opcodes.constant';
import { Packet } from '@congatudo/core/value-objects/packet.value-object';

export function toStringStream(): Transform[] {
  return [
    new Transform({
      objectMode: true,
      transform(packet: Packet<OPDecoderLiteral>, _, done) {
        this.push(packet.toString() + '\n');
        done();
      },
    }),
  ];
}
