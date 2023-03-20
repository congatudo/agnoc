import { Socket } from 'net';
import { Duplex } from 'stream';
import { debug, DomainException } from '@agnoc/toolkit';
import type { PacketMapper } from './mappers/packet.mapper';
import type { Packet } from './value-objects/packet.value-object';
import type { SocketConnectOpts } from 'net';

/** Events emitted by the {@link PacketSocket}. */
export interface PacketSocketEvents {
  /** Emits a {@link Packet} when `data` is received. */
  data: (packet: Packet) => void | Promise<void>;
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

/** Socket that parses and serializes packets sent through a socket. */
export class PacketSocket extends Duplex {
  private readonly debug = (msg: string, ...args: string[]) => debug(__filename).extend(this.toString())(msg, ...args);
  private socket?: Socket;
  private readingPaused = false;

  constructor(private readonly packetMapper: PacketMapper, socket?: Socket) {
    super({ objectMode: true });

    if (socket) {
      this.wrapSocket(socket);
      this.debug('new socket');
    }
  }

  /** Connects to a socket. */
  connect(port: number): Promise<void>;
  connect(port: number, host: string): Promise<void>;
  connect(path: string): Promise<void>;
  connect(options: SocketConnectOpts): Promise<void>;
  async connect(portOrPathOrOptions: number | string | SocketConnectOpts, host?: string): Promise<void> {
    if (this.socket) {
      throw new DomainException('Socket is already connected');
    }

    const socket = new Socket();

    this.wrapSocket(socket);

    await new Promise<void>((resolve) => {
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

    this.debug('connected');
  }

  /** Writes a packet to the socket. */
  override write(packet: Packet, encoding: BufferEncoding, cb: (error: Error | null | undefined) => void): boolean;
  override write(packet: Packet, cb: WriteCallback): boolean;
  override write(packet: Packet): Promise<void>;
  override write(
    packet: Packet,
    encodingOrCb?: BufferEncoding | WriteCallback,
    cb?: WriteCallback,
  ): boolean | Promise<void> {
    if (cb) {
      return super.write(packet, encodingOrCb as BufferEncoding, cb);
    }

    if (encodingOrCb) {
      return super.write(packet, encodingOrCb as WriteCallback);
    }

    return new Promise((resolve, reject) => {
      super.write(packet, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  /** Closes the socket. */
  override end(packet: Packet, cb: EndCallback): this;
  override end(packet: Packet): Promise<void>;
  override end(cb: EndCallback): this;
  override end(): Promise<void>;
  override end(packetOrCb?: Packet | EndCallback, cb?: EndCallback): this | Promise<void> {
    if (cb) {
      return super.end(packetOrCb as Packet, cb);
    }

    if (typeof packetOrCb === 'function') {
      return super.end(packetOrCb);
    }

    return new Promise((resolve) => {
      if (packetOrCb) {
        super.end(packetOrCb, resolve);
        return;
      }

      super.end(resolve);
    });
  }

  /** Returns the local address of the socket. */
  get localAddress(): string | undefined {
    return this.socket?.localAddress;
  }

  /** Returns the local port of the socket. */
  get localPort(): number | undefined {
    return this.socket?.localPort;
  }

  /** Returns the remote address of the socket. */
  get remoteAddress(): string | undefined {
    return this.socket?.remoteAddress;
  }

  /** Returns the remote port of the socket. */
  get remotePort(): number | undefined {
    return this.socket?.remotePort;
  }

  /** Returns whether the socket is connecting. */
  get connecting(): boolean {
    return Boolean(this.socket?.connecting);
  }

  /** Returns whether the socket is connected. */
  get connected(): boolean {
    return this.socket?.readyState === 'open';
  }

  /** Returns an string representation of the socket addresses. */
  override toString(): string {
    const remoteAddress = `${this.remoteAddress ?? 'unknown'}:${this.remotePort ?? 0}`;
    const localAddress = `${this.localAddress ?? 'unknown'}:${this.localPort ?? 0}`;

    return `${remoteAddress}::${localAddress}`;
  }

  private wrapSocket(socket: Socket): void {
    const onConnect: PacketSocketEvents['connect'] = () => this.emit('connect');
    const onEnd: PacketSocketEvents['end'] = () => this.emit('end');
    const onError: PacketSocketEvents['error'] = (err) => this.emit('error', err);
    const onLookup: PacketSocketEvents['lookup'] = (err, address, family, host) =>
      this.emit('lookup', err, address, family, host);
    const onReady: PacketSocketEvents['ready'] = () => this.emit('ready');
    const onReadable: PacketSocketEvents['readable'] = () => setImmediate(this.onReadable.bind(this));
    /* istanbul ignore next - unable to test */
    const onDrain: PacketSocketEvents['drain'] = () => this.emit('drain');
    /* istanbul ignore next - unable to test */
    const onTimeout: PacketSocketEvents['timeout'] = () => this.emit('timeout');
    const onClose: PacketSocketEvents['close'] = (hadError) => {
      this.socket?.off('connect', onConnect);
      this.socket?.off('end', onEnd);
      this.socket?.off('error', onError);
      this.socket?.off('lookup', onLookup);
      this.socket?.off('ready', onReady);
      this.socket?.off('readable', onReadable);
      this.socket?.off('drain', onDrain);
      this.socket?.off('timeout', onTimeout);
      this.socket = undefined;
      this.emit('close', hadError);
    };

    this.socket = socket;
    this.socket.on('connect', onConnect);
    this.socket.on('end', onEnd);
    this.socket.on('error', onError);
    this.socket.on('lookup', onLookup);
    this.socket.on('ready', onReady);
    this.socket.on('readable', onReadable);
    this.socket.on('drain', onDrain);
    this.socket.on('timeout', onTimeout);
    this.socket.once('close', onClose);
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

      this.debug('received packet', packet.toString());

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

  override _write(packet: Packet, _: BufferEncoding, done: InternalCallback): void {
    if (!this.socket) {
      done(new DomainException('Socket is not connected'));
      return;
    }

    const buffer = this.packetMapper.fromDomain(packet);

    this.debug('sending packet', packet.toString());
    this.socket.write(buffer, done);
  }

  override _final(done: InternalCallback): void {
    if (!this.socket) {
      done(new DomainException('Socket is not connected'));
      return;
    }

    this.debug('closing socket');
    this.socket.end(done);
  }
}

export type InternalCallback = (error?: Error | null) => void;
export type WriteCallback = (error: Error | null | undefined) => void;
export type EndCallback = () => void;

export declare interface PacketSocket extends Duplex {
  emit<U extends keyof PacketSocketEvents>(event: U, ...args: Parameters<PacketSocketEvents[U]>): boolean;
  on<U extends keyof PacketSocketEvents>(event: U, listener: PacketSocketEvents[U]): this;
  once<U extends keyof PacketSocketEvents>(event: U, listener: PacketSocketEvents[U]): this;
  write(packet: Packet, encoding: BufferEncoding, cb: WriteCallback): boolean;
  write(packet: Packet, cb: WriteCallback): boolean;
  write(packet: Packet): Promise<void>;
  end(packet: Packet, cb: EndCallback): this;
  end(packet: Packet): Promise<void>;
  end(cb: EndCallback): this;
  end(): Promise<void>;
}
