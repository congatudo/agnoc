import { Transform } from 'stream';
import type { PcapPacket } from 'pcap';
import type { TransformCallback } from 'stream';

export class PCapTransform extends Transform {
  buffers: Record<string, Buffer> = {};

  constructor() {
    super({ objectMode: true });
  }

  override _write(packet: PcapPacket, _: BufferEncoding, done: TransformCallback): void {
    const tcp = packet.payload?.payload?.payload;

    if (!tcp) {
      return done();
    }

    const { data, sport, dport } = tcp;
    const key = `${sport}:${dport}`;

    if (!this.buffers[key]) {
      this.buffers[key] = Buffer.alloc(0);
    }

    if (data) {
      let buffer = Buffer.concat([this.buffers[key], data]);
      let size = buffer.readUInt32LE();

      while (buffer.length >= size) {
        this.push(buffer.subarray(0, size));

        buffer = buffer.subarray(size);

        if (buffer.length < 4) {
          break;
        }

        size = buffer.readUInt32LE();
      }

      this.buffers[key] = buffer;
    }

    done();
  }
}
