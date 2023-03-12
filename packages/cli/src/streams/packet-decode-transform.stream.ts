import { Transform } from 'stream';
import { DomainException } from '@agnoc/toolkit';
import type { PacketMapper } from '@agnoc/transport-tcp';
import type { TransformCallback } from 'stream';

export class PacketDecodeTransform extends Transform {
  private buffer: Buffer = Buffer.alloc(0);

  constructor(private readonly packetMapper: PacketMapper) {
    super({
      objectMode: true,
    });
  }

  override _transform(chunk: Buffer, _: BufferEncoding, done: TransformCallback): void {
    this.buffer = Buffer.concat([this.buffer, chunk]);

    let size = this.buffer.readUInt32LE();

    while (this.buffer.length >= size) {
      try {
        const packet = this.packetMapper.toDomain(this.buffer);

        this.push(packet);
      } catch (e) {
        return done(e as Error);
      }

      this.buffer = this.buffer.subarray(size);

      if (this.buffer.length < 4) {
        break;
      }

      size = this.buffer.readUInt32LE();
    }

    done();
  }

  override _final(done: TransformCallback): void {
    if (this.buffer.length > 0) {
      return done(
        new DomainException(`Unable to decode ${this.buffer.length} byte(s). Possible malformed data stream`),
      );
    }

    done();
  }
}
