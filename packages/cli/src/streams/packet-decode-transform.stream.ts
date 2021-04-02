import { Transform, TransformCallback } from "stream";
import { Packet } from "@agnoc/core/value-objects/packet.value-object";

export class PacketDecodeTransform extends Transform {
  private buffer: Buffer = Buffer.alloc(0);

  constructor() {
    super({
      objectMode: true,
    });
  }

  _transform(chunk: Buffer, _: BufferEncoding, done: TransformCallback): void {
    this.buffer = Buffer.concat([this.buffer, chunk]);

    let size = this.buffer.readUInt32LE();

    while (this.buffer.length >= size) {
      try {
        const packet = Packet.fromBuffer(this.buffer);

        this.push(packet);
      } catch (e) {
        return done(e);
      }

      this.buffer = this.buffer.slice(size);

      if (this.buffer.length < 4) {
        break;
      }

      size = this.buffer.readUInt32LE();
    }

    done();
  }
}
