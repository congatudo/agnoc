import { createServer, IncomingMessage } from "http";
import { ListenOptions } from "net";
import { TypedEmitter } from "tiny-typed-emitter";
import WebSocket, { WebSocketServer as WS } from "ws";
import { WebSocketPacketSocket } from "../sockets/web-socket-packet.socket";
import { debug } from "../utils/debug.util";
import { promisify } from "../utils/promisify.util";
import { ClientRequestPacket } from "../value-objects/web-sockets/client-request-packet.value-object";

interface WebSocketServerEvents {
  connection: (socket: WebSocketPacketSocket) => void;
  error: (err: Error) => void;
  listening: () => void;
  close: () => void;
}

export class WebSocketServer extends TypedEmitter<WebSocketServerEvents> {
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

  get address(): string {
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
