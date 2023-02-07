import { AddressInfo, Socket } from "net";
import { Duplex } from "stream";
import { createWebSocketStream, WebSocket } from "ws";
import { WebSocketPayload } from "../constants/web-sockets.constant";
import { DomainException } from "../exceptions/domain.exception";
import { debug, Debug } from "../utils/debug.util";
import { isEmpty } from "../utils/is-empty.util";
import { WebSocketPacket } from "../value-objects/web-sockets/web-socket-packet.value-object";

interface WebSocketPacketSocketEvents {
  data: (packet: WebSocketPacket<WebSocketPayload>) => void;
  connect: () => void;
  close: () => void;
  drain: () => void;
  end: () => void;
  error: (err: Error) => void;
  lookup: (
    err: Error | null,
    address: string,
    family: string | number,
    host: string
  ) => void;
  ready: () => void;
  timeout: () => void;
  readable: () => void;
}

export declare interface WebSocketPacketSocket extends Duplex {
  emit<U extends keyof WebSocketPacketSocketEvents>(
    event: U,
    ...args: Parameters<WebSocketPacketSocketEvents[U]>
  ): boolean;

  on<U extends keyof WebSocketPacketSocketEvents>(
    event: U,
    listener: WebSocketPacketSocketEvents[U]
  ): this;

  once<U extends keyof WebSocketPacketSocketEvents>(
    event: U,
    listener: WebSocketPacketSocketEvents[U]
  ): this;

  write(
    packet: WebSocketPacket<WebSocketPayload>,
    encoding?: BufferEncoding,
    cb?: (error: Error | null | undefined) => void
  ): boolean;
  write(
    packet: WebSocketPacket<WebSocketPayload>,
    cb?: (error: Error | null | undefined) => void
  ): boolean;
  end(cb?: () => void): this;
  end(packet: WebSocketPacket<WebSocketPayload>, cb?: () => void): this;
}

interface WebSocketPacketSocketProps {
  socket: Socket;
  webSocket: WebSocket;
  packetFactory: (buffer: Buffer) => WebSocketPacket<WebSocketPayload>;
}

type Callback = (error?: Error | null) => void;

const CLOSE_NORMAL = 1000;
const CLOSE_PROTOCOL_ERROR = 1002;
const SERVER_ERROR = 1011;

export class WebSocketPacketSocket extends Duplex {
  static PING_INTERVAL = 30000;

  private debug: Debug;
  private webSocket: WebSocket;
  private socket: Socket;
  private duplex: Duplex;
  private isAlive = true;
  private pingInterval?: NodeJS.Timeout;
  private readingPaused = false;
  private packetFactory: (buffer: Buffer) => WebSocketPacket<WebSocketPayload>;

  constructor({
    webSocket,
    socket,
    packetFactory,
  }: WebSocketPacketSocketProps) {
    super({ objectMode: true });

    this.socket = socket;
    this.webSocket = webSocket;
    this.packetFactory = packetFactory;
    this.duplex = createWebSocketStream(webSocket, {
      readableObjectMode: true,
    });
    this.addListeners();
    this.schedulePing();
    this.debug = debug(`web-socket-packet-socket`).extend(this.toString());
    this.debug("new socket");
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

  override toString(): string {
    return `${this.remoteAddress || "unknown"}:${this.remotePort || 0}::${
      this.localAddress || "unknown"
    }:${this.localPort || 0}(${this.webSocket.readyState})`;
  }

  private addListeners() {
    this.webSocket.on("close", this.handleClose.bind(this));
    this.webSocket.on("open", () => this.emit("connect"));
    this.webSocket.on("error", this.handleError.bind(this));
    this.webSocket.on("pong", this.handlePong.bind(this));
    this.webSocket.on("upgrade", () => this.emit("ready"));
    this.duplex.on("drain", () => this.emit("drain"));
    this.duplex.on("end", () => this.emit("end"));
    this.duplex.on("readable", () => setImmediate(this.onReadable.bind(this)));
    this.duplex.on("error", (err) =>
      this.webSocket.close(SERVER_ERROR, `${err.name}: ${err.message}`)
    );
    this.duplex.on("close", () => this.webSocket.close(CLOSE_NORMAL));
  }

  private schedulePing() {
    this.pingInterval = setInterval(() => {
      if (!this.isAlive) {
        this.webSocket.terminate();
        return;
      }

      this.ping();
    }, WebSocketPacketSocket.PING_INTERVAL);
  }

  private ping() {
    this.debug("sending ping");
    this.isAlive = false;
    this.webSocket.ping();
  }

  private handlePong() {
    this.debug("handling pong");
    this.isAlive = true;
  }

  private clearPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
  }

  private handleClose(code: number, reason: string | Buffer) {
    if (typeof reason !== "string") {
      reason = reason.toString();
    }

    this.debug(`handling close: ${code} ${reason}`);
    this.clearPing();

    if (!isEmpty(reason)) {
      this.emit("error", new Error(reason));
    }

    this.emit("close");
  }

  private handleError(err: Error) {
    this.debug(`handling error: ${err.message}`);
    this.clearPing();
    this.emit("error", err);
  }
  private onReadable(): void {
    if (!this.isAlive) {
      return;
    }

    while (!this.readingPaused) {
      let buffer = this.duplex.read() as Buffer | string;

      if (!buffer) {
        return;
      }

      if (typeof buffer === "string") {
        buffer = Buffer.from(buffer, "utf8");
      }

      let packet;

      try {
        packet = this.packetFactory(buffer);
      } catch (e) {
        const name = (e as Error).name;
        const message = (e as Error).message;

        this.webSocket.close(CLOSE_PROTOCOL_ERROR, `${name}: ${message}`);
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

  override _write(
    packet: WebSocketPacket<WebSocketPayload>,
    _: BufferEncoding,
    done: Callback
  ): void {
    if (!this.socket) {
      done(new DomainException("Called _write without connection"));
      return;
    }

    const buffer = packet.toBuffer();

    try {
      this.webSocket.send(buffer, { binary: false }, done);
    } catch (e) {
      done(e as Error);
    }
  }

  override _final(done: Callback): void {
    if (!this.socket) {
      done(new DomainException("Called _final without connection"));
      return;
    }

    try {
      this.duplex.end(done);
    } catch (e) {
      done(e as Error);
    }
  }

  override _destroy(
    err: Error | null,
    done: (err: Error | null) => void
  ): void {
    if (!this.socket) {
      done(new DomainException("Called _destroy without connection"));
      return;
    }

    try {
      this.duplex.destroy(err || undefined);
      done(err);
    } catch (e) {
      done(e as Error);
    }
  }
}
