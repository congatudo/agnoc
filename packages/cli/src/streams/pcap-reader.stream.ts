import { Readable } from 'stream';
import type { Decode, LiveSessionOptions, PacketWithHeader, PcapSession } from 'pcap';

export interface PCapReaderOptions {
  createSession(fileOrDevice: string, options?: LiveSessionOptions): PcapSession;
  decode: Decode;
}

export class PCapReader extends Readable {
  session: PcapSession;
  decode: Decode;
  buffers: Record<string, Buffer> = {};

  constructor(fileOrDevice: string, options: Partial<LiveSessionOptions> & PCapReaderOptions) {
    super({ objectMode: true });

    this.decode = options.decode;
    this.session = options.createSession(fileOrDevice, options);
    this.session.on('packet', this.onPacket.bind(this));
    this.session.on('complete', this.onComplete.bind(this));
  }

  onPacket(raw: PacketWithHeader): void {
    this.push(this.decode.packet(raw));
  }

  onComplete(): void {
    this.push(null);
  }

  override _read(): void {
    return;
  }
}
