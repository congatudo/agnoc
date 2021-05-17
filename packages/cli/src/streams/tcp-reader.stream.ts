import {
  Decode,
  LiveSessionOptions,
  PacketWithHeader,
  PcapSession,
} from "pcap";
import { Readable } from "stream";

interface TCPReaderOptions {
  createSession(
    fileOrDevice: string,
    options?: LiveSessionOptions
  ): PcapSession;
  decode: Decode;
}

export class TCPReader extends Readable {
  session!: PcapSession;
  decode!: Decode;
  buffers: Record<string, Buffer> = {};

  constructor(
    fileOrDevice: string,
    options: Partial<LiveSessionOptions> & TCPReaderOptions
  ) {
    super({ objectMode: true });

    this.decode = options.decode;
    this.session = options.createSession(fileOrDevice, options);
    this.session.on("packet", this.onPacket.bind(this));
    this.session.on("complete", this.onComplete.bind(this));
  }

  onPacket(raw: PacketWithHeader): void {
    const tcp = this.decode.packet(raw).payload?.payload?.payload;

    if (!tcp) {
      return;
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
        this.push(buffer.slice(0, size));

        buffer = buffer.slice(size);

        if (buffer.length < 4) {
          break;
        }

        size = buffer.readUInt32LE();
      }

      this.buffers[key] = buffer;
    }
  }

  onComplete(): void {
    this.push(null);
  }

  override _read(): void {
    return;
  }
}
