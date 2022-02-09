import express from "express";
import { createServer, IncomingMessage, Server } from "http";
import { debug, Debug } from "./utils/debug.util";
import WebSocket, { createWebSocketStream, WebSocketServer as WS } from "ws";
import { AddressInfo, Socket } from "net";
import {
  DomainPrimitive,
  Primitives,
  ValueObject,
} from "./base-classes/value-object.base";
import { isPresent } from "./utils/is-present.util";
import { ArgumentNotProvidedException } from "./exceptions/argument-not-provided.exception";
import { TypedEmitter } from "tiny-typed-emitter";
import { Duplex } from "stream";
import { DomainException } from "./exceptions/domain.exception";
import { ArgumentInvalidException } from "./exceptions/argument-invalid.exception";
import { ID } from "./value-objects/id.value-object";
import { User } from "./entities/user.entity";
import { randomUUID } from "crypto";
import { DeviceSystem } from "./value-objects/device-system.value-object";
import { DeviceVersion } from "./value-objects/device-version.value-object";
import { Device } from "./entities/device.entity";

async function main() {
  const server = new CloudServer();

  await server.listen("0.0.0.0");

  process.on("SIGINT", () => {
    void server.close();
  });
}

class CloudServer {
  private debug = debug("http-server");
  private robots = new Map() as Map<WebSocketConnection, WebSocketRobot>;
  private servers = {
    discovery: new DiscoveryHttpServer(),
    logger: new LoggerHttpServer(),
    eventLog: new EventLogHttpServer(),
    webSocket: new WebSocketServer(),
  };
  private handlers: WebSocketMessageHandlers = {
    "sweeper-robot-center/auth/login": this.handleClientLogin.bind(this),
  } as const;

  constructor() {
    this.addListeners();
  }

  async listen(host?: string): Promise<void> {
    this.debug(`listening servers`);

    await Promise.all([
      this.servers.discovery.listen({ host, port: 4010 }),
      this.servers.logger.listen({ host, port: 8002 }),
      this.servers.eventLog.listen({ host, port: 8006 }),
      this.servers.webSocket.listen({ host, port: 9090 }),
    ]);
  }

  async close(): Promise<void> {
    this.debug(`closing servers`);

    await Promise.all([
      this.servers.discovery.close(),
      this.servers.logger.close(),
      this.servers.eventLog.close(),
      this.servers.webSocket.close(),
    ]);
  }

  private addListeners() {
    this.servers.webSocket.on(
      "connection",
      this.handleWebSocketConnection.bind(this)
    );
  }

  private handleWebSocketConnection(socket: WebSocketPacketSocket) {
    const connection = new WebSocketConnection(socket);

    connection.on("data", (packet) => {
      const message = new WebSocketMessage({ connection, packet });

      this.handleMessage(message);
    });
  }

  private handleMessage<Payload extends ClientRequest>(
    message: WebSocketMessage<Payload>
  ) {
    const handler = this.handlers[message.command] as
      | WebSocketMessageHandler<Payload>
      | undefined;

    if (handler) {
      return handler(message);
    }

    const robot = this.robots.get(message.connection);

    if (robot) {
      robot.handleMessage(message);
      return;
    }

    // TODO: handle unknown command
    throw new Error(`no handler for ${message.command}`);
  }

  private handleClientLogin(message: WebSocketMessage<AuthLoginClientRequest>) {
    const payload = message.packet.toJSON();
    const multiplexer = new WebSocketMultiplexer();
    const device = new Device({
      id: ID.generate(),
      system: new DeviceSystem({
        deviceSerialNumber: payload.content.sn,
        deviceMac: payload.content.mac,
        deviceType: 23,
        customerFirmwareId: payload.content.factoryId,
        ctrlVersion: payload.content.packageVersions[0].ctrlVersion,
      }),
      version: new DeviceVersion({
        software: "",
        hardware: "",
      }),
    });
    const user = new User({
      id: ID.generate(),
    });
    const bindList: number[] = [
      ID.generate().value,
      user.id.value,
      ID.generate().value,
    ];
    const robot = new WebSocketRobot({ device, user, multiplexer });

    robot.addConnection(message.connection);

    this.robots.set(message.connection, robot);

    void message.respond({
      data: {
        AUTH: randomUUID(),
        FACTORY_ID: String(payload.content.factoryId),
        USERNAME: payload.content.sn,
        CONNECTION_TYPE: "sweeper",
        PROJECT_TYPE: payload.content.projectType,
        ROBOT_TYPE: "sweeper",
        SN: payload.content.sn,
        MAC: payload.content.mac,
        BIND_LIST: JSON.stringify(bindList.map(String)),
        COUNTRY_CITY: encodeURIComponent(
          JSON.stringify({
            continent: "Unknown",
            country: "Unknown",
            city: "Unknown",
          })
        ),
      },
      clientType: "ROBOT",
      id: String(device.id.value),
      resetCode: 0,
    });
  }
}

interface WebSocketRobotEvents {
  updateDevice: () => void;
  updateMap: () => void;
  updateRobotPosition: () => void;
  updateChargerPosition: () => void;
}

export interface WebSocketRobotProps {
  device: Device;
  user: User;
  multiplexer: WebSocketMultiplexer;
}

class WebSocketRobot extends TypedEmitter<WebSocketRobotEvents> {
  public readonly device: Device;
  public readonly user: User;
  private readonly multiplexer: WebSocketMultiplexer;
  private debug: Debug;
  private handlers: WebSocketMessageHandlers = {
    "heart-beat": this.handleHeartBeat.bind(this),
  };

  constructor({ device, user, multiplexer }: WebSocketRobotProps) {
    super();
    this.device = device;
    this.user = user;
    this.multiplexer = multiplexer;
    this.debug = debug(__filename).extend(this.device.id.toString());
    this.debug("new robot");
  }

  get isConnected(): boolean {
    return this.multiplexer.hasConnections;
  }

  override toString(): string {
    return [
      `device: ${this.device.toString()}`,
      `user: ${this.user.toString()}`,
    ].join(" ");
  }

  disconnect(): void {
    this.debug("disconnecting...");

    return this.multiplexer.close();
  }

  addConnection(connection: WebSocketConnection): void {
    const added = this.multiplexer.addConnection(connection);

    if (added && this.multiplexer.connectionCount === 2) {
      void this.handshake();
    }
  }

  handleMessage<Payload extends ClientRequest>(
    message: WebSocketMessage<Payload>
  ) {
    const handler = this.handlers[message.command] as
      | WebSocketMessageHandler<Payload>
      | undefined;

    if (handler) {
      handler(message);
    } else {
      this.debug(`unhandled command ${message.command}`);
    }
  }

  private handshake() {
    // TODO
  }

  private handleHeartBeat(message: WebSocketMessage<HeartbeatClientRequest>) {
    void message.respond(String(new Date().getTime()));
  }
}

type WebSocketMultiplexerEvents<Payload extends ClientRequest> = {
  [key in Payload["service"]]: (packet: ClientRequestPacket<Payload>) => void;
} & {
  data: (packet: ClientRequestPacket<Payload>) => void;
  error: (err: Error) => void;
};

interface WebSocketMultiplexerSendArguments<Payload extends ServerRequest> {
  command: Payload["tag"];
  content: Payload["content"];
}

class WebSocketMultiplexer extends TypedEmitter<
  WebSocketMultiplexerEvents<ClientRequest>
> {
  private connections: WebSocketConnection[] = [];
  private debug = debug(__filename);

  get hasConnections(): boolean {
    return this.connections.length > 0;
  }

  get connectionCount(): number {
    return this.connections.length;
  }

  addConnection(connection: WebSocketConnection): boolean {
    if (!this.connections.includes(connection)) {
      connection.on("data", this.handlePacket.bind(this));
      connection.on("error", (err) => this.handleError(connection, err));
      connection.on("close", () => this.handleClose(connection));

      this.connections = [...this.connections, connection];
      this.debug("added connection");

      return true;
    }

    return false;
  }

  async send<Payload extends ServerRequest>(
    args: WebSocketMultiplexerSendArguments<Payload>
  ): Promise<void> {
    const connection = this.connections[0];

    if (!connection) {
      this.emit(
        "error",
        new DomainException(
          `No valid connection found to send packet ${args.command}`
        )
      );

      return;
    }

    await connection.send(args);
  }

  close(): void {
    this.debug("closing connections...");
    this.connections.forEach((connection) => {
      connection.close();
    });
  }

  private handlePacket(packet: ClientRequestPacket<ClientRequest>): void {
    this.emit(packet.service, packet);
    this.emit("data", packet);
  }

  private handleError(connection: WebSocketConnection, err: Error): void {
    this.emit("error", err);
    this.handleClose(connection);
  }

  private handleClose(connection: WebSocketConnection): void {
    // TODO: fix this.
    // Remove all listeners to prevent mem leaks.
    // But ensure error handling works...
    // connection.removeAllListeners();

    this.connections = this.connections.filter((conn) => conn !== connection);
    this.debug("removed connection");
  }
}

export type WebSocketMessageHandler<Payload extends ClientRequest> = (
  message: WebSocketMessage<Payload>
) => void;

export type WebSocketMessageHandlers = Partial<
  {
    [Command in ClientRequestCommand]: WebSocketMessageHandler<
      PickClientRequest<Command>
    >;
  }
>;

interface WebSocketMessageProps<Payload extends ClientRequest> {
  connection: WebSocketConnection;
  packet: ClientRequestPacket<Payload>;
}

class WebSocketMessage<Payload extends ClientRequest> extends ValueObject<
  WebSocketMessageProps<Payload>
> {
  get connection() {
    return this.props.connection;
  }

  get packet() {
    return this.props.packet;
  }

  get command() {
    return this.packet.service;
  }

  async respond(
    result: PickServerResponse<Payload["service"]>["result"]
  ): Promise<void> {
    // TODO: fix this unknown
    return await this.connection.respond({
      packet: this.packet,
      result,
    } as unknown as WebSocketConnectionRespondArguments<Payload>);
  }

  public override toString(): string {
    return "[Message]";
  }

  protected validate(props: WebSocketMessageProps<Payload>): void {
    if (![props.connection, props.packet].every(isPresent)) {
      throw new ArgumentNotProvidedException(
        "Missing property in web socket message constructor"
      );
    }

    if (!(props.connection instanceof WebSocketConnection)) {
      throw new ArgumentInvalidException(
        "Invalid connection in web socket message constructor"
      );
    }

    if (!(props.packet instanceof ClientRequestPacket)) {
      throw new ArgumentInvalidException(
        "Invalid packet in web socket message constructor"
      );
    }
  }
}

interface ListenOptions {
  host?: string;
  port: number;
}

abstract class HttpServer {
  protected abstract debug: Debug;
  protected app = express();
  protected server?: Server;

  constructor() {
    this.addMiddlewares();
    this.addRoutes();
    this.addErrorHandlers();
  }

  async listen(options: ListenOptions): Promise<void> {
    await promisify((callback) => {
      if (options.host) {
        this.server = this.app.listen(options.port, options.host, callback);
      } else {
        this.server = this.app.listen(options.port, callback);
      }
    });

    this.debug(`listening to ${this.address}`);
  }

  get address() {
    const address = this.server?.address();

    if (address) {
      if (typeof address !== "string") {
        return `${address.address}:${address.port}`;
      }

      return address;
    }

    return "unknown";
  }

  async close(): Promise<void> {
    this.debug(`closing server`);

    await promisify((callback) => {
      if (!this.server) {
        throw new Error("Server not started");
      }

      this.server.close(callback);
    });
  }

  protected abstract addMiddlewares(): void;
  protected abstract addRoutes(): void;
  protected abstract addErrorHandlers(): void;
}

class DiscoveryHttpServer extends HttpServer {
  protected debug = debug("discovery-http-server");

  protected addMiddlewares() {
    this.app.use(express.json());
  }

  protected addRoutes() {
    this.app.post(
      "/service-publish/open/upgrade/try_upgrade",
      this.handleUpgrade.bind(this)
    );
    this.app.all("*", this.handleOther.bind(this));
  }

  protected addErrorHandlers(): void {
    this.app.use(this.handleError.bind(this));
  }

  protected handleUpgrade(req: express.Request, res: express.Response) {
    this.debug("handleUpgrade", req.body);

    const remoteAddress = req.socket.remoteAddress || "localhost";

    res.send({
      code: 0,
      result: {
        targetUrls: [
          `ws://${remoteAddress}:9090`,
          `http://${remoteAddress}:8002`,
          `http://${remoteAddress}:8006`,
        ],
      },
    });
  }

  private handleOther(req: express.Request, res: express.Response) {
    this.debug(`handleOther(${req.method} ${req.url}): `, req.body);

    res.sendStatus(404);
  }

  private handleError(err: Error, req: express.Request, res: express.Response) {
    this.debug(`handleError(${req.method} ${req.url}): ${err.message}`);

    res.sendStatus(500);
  }
}

class EventLogHttpServer extends HttpServer {
  protected debug = debug("event-log-http-server");

  protected addMiddlewares() {
    this.app.use(express.json());
  }

  protected addRoutes() {
    this.app.post(
      "/sweeper-report/robot/event_log",
      this.handleEventLog.bind(this)
    );
    this.app.all("*", this.handleOther.bind(this));
  }

  protected addErrorHandlers(): void {
    this.app.use(this.handleError.bind(this));
  }

  protected handleEventLog(req: express.Request, res: express.Response) {
    this.debug(`handleEventLog`, req.body);

    res.send({
      code: 0,
      result: true,
    });
  }

  private handleOther(req: express.Request, res: express.Response) {
    this.debug(`handleOther(${req.method} ${req.url}): `, req.body);

    res.sendStatus(404);
  }

  private handleError(err: Error, req: express.Request, res: express.Response) {
    this.debug(`handleError(${req.method} ${req.url}): ${err.message}`);

    res.sendStatus(500);
  }
}

class LoggerHttpServer extends HttpServer {
  protected debug = debug("logger-http-server");

  protected addMiddlewares() {
    this.app.use(express.json());
  }

  protected addRoutes() {
    this.app.all("*", this.handleOther.bind(this));
  }

  protected addErrorHandlers(): void {
    this.app.use(this.handleError.bind(this));
  }

  private handleOther(req: express.Request, res: express.Response) {
    this.debug(`handleOther(${req.method} ${req.url}): `, req.body);

    res.sendStatus(404);
  }

  private handleError(err: Error, req: express.Request, res: express.Response) {
    this.debug(`handleError(${req.method} ${req.url}): ${err.message}`);

    res.sendStatus(500);
  }
}

function promisify<T, E>(fn: (callback: (err?: E, value?: T) => void) => void) {
  return new Promise((resolve, reject) => {
    try {
      fn((err?: E, value?: T) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

interface WebSocketServerEvents {
  connection: (socket: WebSocketPacketSocket) => void;
  error: (err: Error) => void;
  listening: () => void;
  close: () => void;
}

class WebSocketServer extends TypedEmitter<WebSocketServerEvents> {
  private debug = debug("web-socket-server");
  private server = createServer();
  private app = new WS({ server: this.server });

  constructor() {
    super();
    this.addListeners();
  }

  async listen(options: ListenOptions): Promise<void> {
    await promisify((callback) => this.server.listen(options, callback));

    this.debug(`listening to ${this.address}`);
  }

  get address() {
    const address = this.server.address();

    if (address) {
      if (typeof address !== "string") {
        return `${address.address}:${address.port}`;
      }

      return address;
    }

    return "unknown";
  }

  async close(): Promise<void> {
    this.debug(`closing server`);

    this.app.clients.forEach((client) => {
      client.close();
    });

    await promisify((callback) => this.app.close(callback));
    await promisify((callback) => this.server.close(callback));
  }

  private addListeners() {
    this.app.on("connection", this.handleConnection.bind(this));
    this.server.on("error", (e) => this.emit("error", e));
    this.server.on("listening", () => this.emit("listening"));
    this.server.on("close", () => this.emit("close"));
  }

  private handleConnection(webSocket: WebSocket, req: IncomingMessage) {
    const socket = new WebSocketPacketSocket({
      webSocket,
      socket: req.socket,
      packetFactory: ClientRequestPacket.fromBuffer.bind(ClientRequestPacket),
    });

    this.emit("connection", socket);
    this.debug(`received connection ${socket.toString()}`);
  }
}

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

declare interface WebSocketPacketSocket extends Duplex {
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
  end(cb?: () => void): void;
  end(packet: WebSocketPacket<WebSocketPayload>, cb?: () => void): void;
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

class WebSocketPacketSocket extends Duplex {
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
    this.duplex = createWebSocketStream(webSocket, { objectMode: true });
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

  private handleClose(code: number, reason: string) {
    this.debug(`handling close: ${code} ${reason}`);
    this.clearPing();
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
      const buffer = this.duplex.read() as Buffer;

      if (!buffer) {
        return;
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
      this.duplex.write(buffer, done);
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
}

type WebSocketConnectionEvents<Command extends ClientRequestCommand> = {
  [key in Command]: (
    packet: ClientRequestPacket<PickClientRequest<Command>>
  ) => void;
} & {
  data: (packet: ClientRequestPacket<ClientRequest>) => void;
  close: () => void;
  error: (err: Error) => void;
};

interface WebSocketConnectionSendArguments<Payload extends ServerRequest> {
  command: Payload["tag"];
  content: Payload["content"];
}

interface WebSocketConnectionRespondArguments<Payload extends ClientRequest> {
  packet: ClientRequestPacket<Payload>;
  result: PickServerResponse<Payload["service"]>["result"];
}

export class WebSocketConnection extends TypedEmitter<
  WebSocketConnectionEvents<ClientRequestCommand>
> {
  private debug = debug("web-socket-connection");
  private socket: WebSocketPacketSocket;

  constructor(socket: WebSocketPacketSocket) {
    super();
    this.socket = socket;
    this.addListeners();
    this.debug = debug(`web-socket-connection`).extend(this.toString());
    this.debug("new connection");
  }

  override toString(): string {
    return this.socket.toString();
  }

  async send<Payload extends ServerRequest>({
    command,
    content,
  }: WebSocketConnectionSendArguments<Payload>): Promise<void> {
    const packet = new ServerRequestPacket({
      tag: command,
      content,
    });

    this.debug(`sending packet ${packet.toString()}`);

    return await this.write(packet);
  }

  async respond<Payload extends ClientRequest>({
    packet,
    result,
  }: WebSocketConnectionRespondArguments<Payload>): Promise<void> {
    const response = new ServerResponsePacket({
      code: 0,
      traceId: String(packet.traceId),
      service: packet.service,
      result,
    } as ServerResponse);

    this.debug(`sending packet ${packet.toString()}`);

    return await this.write(response);
  }

  close(): void {
    this.debug("closing socket...");

    return this.socket.end();
  }

  private async write(
    packet: WebSocketPacket<ServerRequest | ServerResponse>
  ): Promise<void> {
    await promisify((callback) => this.socket.write(packet, callback));
  }

  private addListeners() {
    this.socket.on("data", (packet: WebSocketPacket<WebSocketPayload>) =>
      this.handlePacket(packet as ClientRequestPacket<ClientRequest>)
    );
    this.socket.on("error", this.handleError.bind(this));
    this.socket.on("close", this.handleClose.bind(this));
  }

  private handlePacket(packet: ClientRequestPacket<ClientRequest>) {
    this.debug(`received packet: ${packet.toString()}`);
    this.emit(packet.command, packet);
    this.emit("data", packet);
  }

  private handleClose() {
    this.debug("handling close");
    this.emit("close");
  }

  private handleError(err: Error) {
    this.debug(`handling error: ${err.message}`);
    this.emit("error", err);
  }
}

interface BaseClientRequest {
  traceId: number;
  method: "POST" | "Put";
}

interface PackageVersion {
  packageType: string;
  version: number;
  versionName: string;
  ctrlVersion: string;
}

interface BaseServerResponse {
  code: number;
  traceId: string;
}

interface AuthLoginClientRequest extends BaseClientRequest {
  service: "sweeper-robot-center/auth/login";
  content: {
    factoryId: number;
    mac: string;
    keyt: string;
    packageVersions: PackageVersion[];
    projectType: string;
    sn: string;
  };
}

interface AuthLoginServerResponse extends BaseServerResponse {
  service: "sweeper-robot-center/auth/login";
  result: {
    data: {
      AUTH: string;
      FACTORY_ID: string;
      USERNAME: string;
      CONNECTION_TYPE: string;
      PROJECT_TYPE: string;
      ROBOT_TYPE: string;
      SN: string;
      MAC: string;
      BIND_LIST: string;
      COUNTRY_CITY: string;
    };
    clientType: string;
    id: string;
    resetCode: number;
  };
}

interface HeartbeatClientRequest extends BaseClientRequest {
  service: "heart-beat";
  content?: number;
}

interface HeartbeatServerResponse extends BaseServerResponse {
  service: "heart-beat";
  result: string;
}

interface InfoReportStatusClientRequest extends BaseClientRequest {
  service: `sweeper-robot-center/info_report/status/${number}`;
  content: {
    did: number;
  };
}

interface RobotCurrentStatus {
  map_head_id: number;
  areaCleanFlag: number;
  workMode: number;
  battary: number;
  chargeStatus: number;
  type: number;
  faultCode: number;
  cleanPerference: number;
  repeatClean: number;
  cleanTime: number;
  cleanSize: number;
  waterlevel: number;
  dustBox_type: number;
  mop_type: number;
  house_name: string;
  map_count: number;
  current_map_name: string;
  cleaning_roomId: number;
  control: "status";
  did: number;
}

interface DeviceReportDataClientRequest extends BaseClientRequest {
  service: "sweeper-robot-center/device/report_data";
  content: {
    data: RobotCurrentStatus;
    clientType: string;
  };
}

interface InfoReportStatusServerResponse extends BaseServerResponse {
  service: `sweeper-robot-center/info_report/status/${number}`;
  result: boolean;
}

interface DeviceReportDataServerResponse extends BaseServerResponse {
  service: "sweeper-robot-center/device/report_data";
  result: boolean;
}

interface ToBindServerRequest {
  tag: "sweeper-transmit/to_bind";
  content:
    | {
        begin_time: number;
        control:
          | "get_status"
          | "set_mode"
          | "get_voice"
          | "get_quiet_time"
          | "device_ctrl";
        ctrltype: number;
        end_time: number;
        isSave: number;
        is_open: number;
        mapid: number;
        operation: number;
        result: number;
        type: number;
        value: number;
        voiceMode: number;
        volume: number;
      }
    | {
        control: "get_systemConfig";
        type: number;
        value: number;
      }
    | {
        control: "lock_device" | "upgrade_packet_info";
        userid: number;
      }
    | {
        control: "set_time";
        timezone: number;
        time: number;
      }
    | {
        control: "get_map";
        start_index: number;
        end_index: number;
        taskid: number;
        mask: number;
        mapid: number;
        type: number;
      };
}

interface ToBindClientRequest extends BaseClientRequest {
  service: "sweeper-transmit/transmit/to_bind";
  content: {
    data:
      | RobotCurrentStatus
      | {
          type: number;
          value: number;
          control: "get_systemConfig";
          did: number;
        }
      | {
          result: number;
          control: "lock_device" | "set_time";
          did: number;
        }
      | {
          is_open: number;
          begin_time: number;
          end_time: number;
          control: "get_quiet_time";
          did: number;
        }
      | {
          voiceMode: number;
          volume: number;
          control: "get_voice";
          did: number;
        }
      | {
          newVersion: number;
          packageSize: string;
          systemVersion: string;
          otaPackageVersion: string;
          remoteUrl: string;
          forceUpgrade: number;
          ctrlVersion: string;
          control: "upgrade_packet_info";
          did: number;
        }
      | {
          ctrltype: number;
          result: number;
          control: "device_ctrl";
          did: number;
        }
      | {
          type: number;
          result: number;
          control: "get_map";
          did: number;
        };
    targets: number[];
    clientType: string;
  };
}

interface ToBindServerResponse extends BaseServerResponse {
  service: "sweeper-transmit/transmit/to_bind";
  result: boolean;
}

interface RobotSynNoCacheServerResponse extends BaseServerResponse {
  service: "sweeper-map/robot/syn_no_cache";
  result: boolean;
}

type ClientRequest =
  | AuthLoginClientRequest
  | HeartbeatClientRequest
  | InfoReportStatusClientRequest
  | DeviceReportDataClientRequest
  | ToBindClientRequest;

type ServerResponse =
  | AuthLoginServerResponse
  | HeartbeatServerResponse
  | InfoReportStatusServerResponse
  | DeviceReportDataServerResponse
  | ToBindServerResponse
  | RobotSynNoCacheServerResponse;

type ServerRequest = ToBindServerRequest;

type WebSocketPayload = ClientRequest | ServerResponse | ServerRequest;
type ClientRequestCommand = Pick<ClientRequest, "service">["service"];
type ServerResponseCommand = Pick<ServerResponse, "service">["service"];
type ServerRequestCommand = Pick<ServerRequest, "tag">["tag"];

type PickClientRequest<T extends ClientRequestCommand> = Extract<
  ClientRequest,
  { service: T }
>;

type PickServerResponse<T extends ServerResponseCommand> = Extract<
  ServerResponse,
  { service: T }
>;

type PickWebSocketCommand<T extends WebSocketPayload> = T extends ServerRequest
  ? Extract<ServerRequestCommand, T["tag"]>
  : T extends ClientRequest
  ? Extract<ClientRequestCommand, T["service"]>
  : T extends ServerResponse
  ? Extract<ServerResponseCommand, T["service"]>
  : never;

function unpack(buffer: Buffer): WebSocketPayload {
  const payload = JSON.parse(buffer.toString("utf8")) as Record<
    string,
    unknown
  >;

  if (payload.content) {
    payload.content = JSON.parse(payload.content as string);
  }

  return payload as unknown as WebSocketPayload;
}

function pack(payload: Record<string, unknown>): Buffer {
  if (payload.content) {
    payload.content = JSON.stringify(payload.content);
  }

  return Buffer.from(JSON.stringify(payload));
}

function isServerRequest(payload: WebSocketPayload): payload is ServerRequest {
  return typeof (payload as ServerRequest).tag !== "undefined";
}

class WebSocketPacket<
  Payload extends WebSocketPayload
> extends ValueObject<Payload> {
  get command(): PickWebSocketCommand<Payload> {
    if (isServerRequest(this.props)) {
      return this.props.tag as PickWebSocketCommand<Payload>;
    }

    return this.props.service as PickWebSocketCommand<Payload>;
  }

  toBuffer(): Buffer {
    return pack(this.props as unknown as Record<string, unknown>);
  }

  override toJSON(): Payload {
    return super.toJSON() as Payload;
  }

  protected validate(
    props: Payload extends Primitives | Date
      ? DomainPrimitive<Payload>
      : Payload
  ): void {
    if (!isPresent(props))
      throw new ArgumentNotProvidedException(
        "Missing property in packet constructor"
      );
  }

  static fromBuffer(buffer: Buffer): WebSocketPacket<WebSocketPayload> {
    return new this(unpack(buffer));
  }

  static fromJSON(
    payload: WebSocketPayload
  ): WebSocketPacket<WebSocketPayload> {
    return new this(payload);
  }
}

class ClientRequestPacket<
  Payload extends ClientRequest
> extends WebSocketPacket<Payload> {
  get traceId() {
    return this.props.traceId;
  }

  get method() {
    return this.props.method;
  }

  get service() {
    return this.props.service;
  }

  protected override validate(
    props: Payload extends Primitives | Date
      ? DomainPrimitive<Payload>
      : Payload
  ): void {
    super.validate(props);

    const validProps = ["traceId", "method", "service"];

    validProps.forEach((validProp) => {
      if (!(validProp in props))
        throw new ArgumentNotProvidedException(
          `Missing property '${validProp}' in web client request packet constructor`
        );
    });
  }
}

class ServerResponsePacket<
  Payload extends ServerResponse
> extends WebSocketPacket<Payload> {
  get code() {
    return this.props.code;
  }

  get traceId() {
    return this.props.traceId;
  }

  get service() {
    return this.props.service;
  }

  get result() {
    return this.props.result;
  }

  protected override validate(
    props: Payload extends Primitives | Date
      ? DomainPrimitive<Payload>
      : Payload
  ): void {
    super.validate(props);

    const validProps = ["code", "traceId", "service", "result"];

    validProps.forEach((validProp) => {
      if (!(validProp in props))
        throw new ArgumentNotProvidedException(
          `Missing property '${validProp}' in server response packet constructor`
        );
    });
  }
}

class ServerRequestPacket<
  Payload extends ServerRequest
> extends WebSocketPacket<Payload> {
  get tag() {
    return this.props.tag;
  }

  get content() {
    return this.props.content;
  }

  protected override validate(
    props: Payload extends Primitives | Date
      ? DomainPrimitive<Payload>
      : Payload
  ): void {
    super.validate(props);

    const validProps = ["tag", "content"];

    validProps.forEach((validProp) => {
      if (!(validProp in props))
        throw new ArgumentNotProvidedException(
          `Missing property '${validProp}' in server request packet constructor`
        );
    });
  }
}

void main();
