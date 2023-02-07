import { ListenOptions, Server, Socket } from "net";
import { TypedEmitter } from "tiny-typed-emitter";
import { PacketSocket } from "../sockets/packet.socket";

interface PacketServerEvents {
  connection: (socket: PacketSocket) => void;
  error: (err: Error) => void;
  listening: () => void;
  close: () => void;
}

export class PacketServer extends TypedEmitter<PacketServerEvents> {
  private server: Server;

  constructor() {
    super();
    this.server = new Server();
    this.addListeners();
  }

  get isListening(): boolean {
    return this.server.listening;
  }

  async listen(port?: number): Promise<void>;
  async listen(port?: number, hostname?: string): Promise<void>;
  async listen(options: ListenOptions): Promise<void>;
  async listen(
    portOrOptions?: number | ListenOptions,
    hostname?: string
  ): Promise<void> {
    return await new Promise((resolve) => {
      if (typeof portOrOptions === "number" && hostname) {
        this.server.listen(portOrOptions, hostname, resolve);
      } else {
        this.server.listen(portOrOptions, resolve);
      }
    });
  }

  async close(): Promise<void> {
    return await new Promise((resolve, reject) => {
      this.server.close((e) => {
        if (e) {
          reject(e);
          return;
        }

        resolve();
      });
    });
  }

  private onConnection(socket: Socket): void {
    const client = new PacketSocket({ socket });

    this.emit("connection", client);
  }

  private addListeners(): void {
    this.server.on("connection", this.onConnection.bind(this));
    this.server.on("error", (e) => this.emit("error", e));
    this.server.on("listening", () => this.emit("listening"));
    this.server.on("close", () => this.emit("close"));
  }
}
