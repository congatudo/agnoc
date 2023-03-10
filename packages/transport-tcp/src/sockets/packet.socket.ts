import { Socket } from 'net';
import { Duplex } from 'stream';
import { DomainException } from '@agnoc/toolkit';
import type { PayloadObjectName } from '../constants/payloads.constant';
import type { PacketMapper } from '../mappers/packet.mapper';
import type { Packet } from '../value-objects/packet.value-object';
import type { SocketConnectOpts } from 'net';

export type Callback = (error?: Error | null) => void;

export interface PacketSocketEvents {
  data: (packet: Packet<PayloadObjectName>) => void;
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
    packet: Packet<PayloadObjectName>,
    encoding?: BufferEncoding,
    cb?: (error: Error | null | undefined) => void,
  ): boolean;
  write(packet: Packet<PayloadObjectName>, cb?: (error: Error | null | undefined) => void): boolean;
  end(cb?: () => void): this;
  end(packet: Packet<PayloadObjectName>, cb?: () => void): this;
}

/** Socket that parses and serializes packets sent through a socket. */
export class PacketSocket extends Duplex {
  private socket?: Socket;
  private readingPaused = false;

  constructor(private readonly packetMapper: PacketMapper, socket?: Socket) {
    super({ objectMode: true });

    if (socket) {
      this.wrapSocket(socket);
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
        return socket.connect(portOrPathOrOptions, host, resolve);
      }

      if (typeof portOrPathOrOptions === 'number') {
        return socket.connect(portOrPathOrOptions, resolve);
      }

      /* istanbul ignore if - unable to test */
      if (typeof portOrPathOrOptions === 'string') {
        return socket.connect(portOrPathOrOptions, resolve);
      }

      return socket.connect(portOrPathOrOptions, resolve);
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

  get connecting(): boolean {
    return Boolean(this.socket?.connecting);
  }

  private wrapSocket(socket: Socket): void {
    this.socket = socket;
    this.socket.on('close', (hadError) => this.emit('close', hadError));
    this.socket.on('connect', () => this.emit('connect'));
    this.socket.on('end', () => this.emit('end'));
    this.socket.on('error', (err) => this.emit('error', err));
    this.socket.on('lookup', (err, address, family, host) => this.emit('lookup', err, address, family, host)); // prettier-ignore
    this.socket.on('ready', () => this.emit('ready'));
    this.socket.on('readable', () => setImmediate(this.onReadable.bind(this)));
    /* istanbul ignore next - unable to test */
    this.socket.on('drain', () => this.emit('drain'));
    /* istanbul ignore next - unable to test */
    this.socket.on('timeout', () => this.emit('timeout'));
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
        this.socket.destroy(new DomainException('Packet max length exceeded'));
        return;
      }

      this.socket.unshift(lenBuf);

      const body = this.socket.read(len) as Buffer;

      if (!body) {
        return;
      }

      let packet;

      try {
        packet = this.packetMapper.toDomain(body);
      } catch (e) {
        this.socket.destroy(e as Error);
        return;
      }

      const pushOk = this.push(packet);

      /* istanbul ignore if - unable to test */
      if (!pushOk) {
        this.readingPaused = true;
      }
    }
  }

  override _read(): void {
    this.readingPaused = false;
    setImmediate(this.onReadable.bind(this));
  }

  override _write(packet: Packet<PayloadObjectName>, _: BufferEncoding, done: Callback): void {
    if (!this.socket) {
      done(new DomainException('Socket is not connected'));
      return;
    }

    const buffer = this.packetMapper.fromDomain(packet);

    this.socket.write(buffer, done);
  }

  override _final(done: Callback): void {
    if (!this.socket) {
      done(new DomainException('Socket is not connected'));
      return;
    }

    this.socket.end(done);
  }
}
