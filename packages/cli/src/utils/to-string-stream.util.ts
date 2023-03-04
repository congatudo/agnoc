import { Transform } from 'stream';
import type { Packet, PayloadObjectName } from '@agnoc/transport-tcp';

export function toStringStream(): Transform[] {
  return [
    new Transform({
      objectMode: true,
      transform(packet: Packet<PayloadObjectName>, _, done) {
        this.push(packet.toString() + '\n');
        done();
      },
    }),
  ];
}
