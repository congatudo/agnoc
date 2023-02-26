import { Transform } from 'stream';
import type { Packet, OPDecoderLiteral } from '@agnoc/transport-tcp';

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
