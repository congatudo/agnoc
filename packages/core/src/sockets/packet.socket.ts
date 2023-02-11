import { AddressInfo, Socket, SocketConnectOpts } from 'net';
import { Duplex } from 'stream';
import { DomainException } from '@agnoc/toolkit';
import { OPDecoderLiteral } from '../constants/opcodes.constant';
import { Packet } from '../value-objects/packet.value-object';

interface PacketSocketProps {
  socket?: Socket;
}

type Callback = (error?: Error | null) => void;

interface PacketSocketEvents {
  data: (packet: Packet<OPDecoderLiteral>) => void;
  connect: () => void;
  close: (hasError: boolean) => void;
  drain: () => void;
  end: () => void;
  error: (err: Error) => void;
  lookup: (err: Error | null, address: string, family: string | number, host: string) => void;
  ready: () => void;
  timeout: () => void;
  readable: () => void;
}

export declare interface PacketSocket extends Duplex {
  emit<U extends keyof PacketSocketEvents>(event: U, ...args: Parameters<PacketSocketEvents[U]>): boolean;

  on<U extends keyof PacketSocketEvents>(event: U, listener: PacketSocketEvents[U]): this;

  once<U extends keyof PacketSocketEvents>(event: U, listener: PacketSocketEvents[U]): this;

  write(
    packet: Packet<OPDecoderLiteral>,
    encoding?: BufferEncoding,
    cb?: (error: Error | null | undefined) => void,
  ): boolean;
  write(packet: Packet<OPDecoderLiteral>, cb?: (error: Error | null | undefined) => void): boolean;
  end(cb?: () => void): this;
  end(packet: Packet<OPDecoderLiteral>, cb?: () => void): this;
}

export class PacketSocket extends Duplex {
  private socket?: Socket;
  private readingPaused = false;

  constructor();
  constructor(props: PacketSocketProps);
  constructor(props?: PacketSocketProps) {
    super({ objectMode: true });

    if (props?.socket) {
      this.wrapSocket(props.socket);
    }
  }

  connect(port: number): Promise<void>;
  connect(port: number, host: string): Promise<void>;
  connect(path: string): Promise<void>;
  connect(options: SocketConnectOpts): Promise<void>;
  connect(portOrPathOrOptions: number | string | SocketConnectOpts, host?: string): Promise<void> {
    const socket = new Socket();

    this.wrapSocket(socket);

    return new Promise((resolve) => {
      if (typeof portOrPathOrOptions === 'number' && host) {
        socket.connect(portOrPathOrOptions, host, resolve);
      } else if (typeof portOrPathOrOptions === 'number') {
        socket.connect(portOrPathOrOptions, resolve);
      } else if (typeof portOrPathOrOptions === 'string') {
        socket.connect(portOrPathOrOptions, resolve);
      } else {
        socket.connect(portOrPathOrOptions, resolve);
      }
    });
  }

  get localAddress(): string | undefined {
    return this.socket?.localAddress;
  }

  get localPort(): number | undefined {
    return this.socket?.localPort;
  }

  get remoteAddress(): string | undefined {
    return this.socket?.remoteAddress;
  }

  get remotePort(): number | undefined {
    return this.socket?.remotePort;
  }

  address(): AddressInfo | Record<string, never> {
    return this.socket?.address() || {};
  }

  get connecting(): boolean {
    return Boolean(this.socket?.connecting);
  }

  private wrapSocket(socket: Socket): void {
    this.socket = socket;
    this.socket.on('close', (hadError) => this.emit('close', hadError));
    this.socket.on('connect', () => this.emit('connect'));
    this.socket.on('drain', () => this.emit('drain'));
    this.socket.on('end', () => this.emit('end'));
    this.socket.on('error', (err) => this.emit('error', err));
    this.socket.on('lookup', (err, address, family, host) => this.emit('lookup', err, address, family, host)); // prettier-ignore
    this.socket.on('ready', () => this.emit('ready'));
    this.socket.on('timeout', () => this.emit('timeout'));
    this.socket.on('readable', () => setImmediate(this.onReadable.bind(this)));
  }

  private onReadable(): void {
    if (!this.socket) {
      return;
    }

    while (!this.readingPaused) {
      const lenBuf = this.socket.read(4) as Buffer;

      if (!lenBuf) {
        return;
      }

      const len = lenBuf.readUInt32LE();

      if (len > 2 ** 20) {
        this.socket.destroy(new DomainException('Max length exceeded'));
        return;
      }

      this.socket.unshift(lenBuf);

      const body = this.socket.read(len) as Buffer;

      if (!body) {
        return;
      }

      let packet;

      try {
        packet = Packet.fromBuffer(body);
      } catch (e) {
        this.socket.destroy(e as Error);
        return;
      }

      const pushOk = this.push(packet);

      if (!pushOk) {
        this.readingPaused = true;
      }
    }
  }

  override _read(): void {
    this.readingPaused = false;
    setImmediate(this.onReadable.bind(this));
  }

  override _write(packet: Packet<OPDecoderLiteral>, _: BufferEncoding, done: Callback): void {
    if (!this.socket) {
      done(new DomainException('Called _write without connection'));
      return;
    }

    const buffer = packet.toBuffer();

    try {
      this.socket.write(buffer, done);
    } catch (e) {
      done(e as Error);
    }
  }

  override _final(done: Callback): void {
    if (!this.socket) {
      done(new DomainException('Called _final without connection'));
      return;
    }

    try {
      this.socket.end(done);
    } catch (e) {
      done(e as Error);
    }
  }
}
