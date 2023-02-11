import { Transform } from 'stream';
import { Packet, OPDecoderLiteral } from '@agnoc/core';

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
