import { Server } from 'net';
import Emittery from 'emittery';
import { PacketSocket } from './packet.socket';
import type { PacketMapper } from './mappers/packet.mapper';
import type { AddressInfo, ListenOptions, Socket, DropArgument } from 'net';

/** Events emitted by the {@link PacketServer}. */
export interface PacketServerEvents {
  /** Emits a {@link PacketSocket} when a new connection is established. */
  connection: PacketSocket;
  /** Emits an error when an error occurs. */
  error: Error;
  /** Emits when the server has been bound after calling `server.listen`. */
  listening: undefined;
  /** Emits when the server closes. */
  close: undefined;
  /** Emits when a packet is dropped due to a full socket buffer. */
  drop: DropArgument | undefined;
}

/** Server that emits `PacketSockets`. */
export class PacketServer extends Emittery<PacketServerEvents> {
  private readonly sockets = new Set<PacketSocket>();
  private readonly server = new Server();

  constructor(private readonly packetMapper: PacketMapper) {
    super();
    this.addListeners();
  }

  /** Returns whether the server is listening for connections. */
  get isListening(): boolean {
    return this.server.listening;
  }

  /**
   * Returns the bound address, the address family name and port of the server
   * as reported by the operating system.
   */
  get address(): AddressInfo | null {
    return this.server.address() as AddressInfo | null;
  }

  /** Starts a server listening for connections. */
  async listen(port?: number): Promise<void>;
  async listen(port?: number, hostname?: string): Promise<void>;
  async listen(options: ListenOptions): Promise<void>;
  async listen(portOrOptions?: number | ListenOptions, hostname?: string): Promise<void> {
    return await new Promise((resolve) => {
      if (typeof portOrOptions === 'number' && hostname) {
        this.server.listen(portOrOptions, hostname, resolve);
      } else {
        this.server.listen(portOrOptions, resolve);
      }
    });
  }

  /** Stops the server from accepting new connections and keeps existing connections. */
  async close(): Promise<void> {
    return await new Promise((resolve, reject) => {
      this.server.close((e) => {
        if (e) {
          reject(e);
          return;
        }

        resolve();
      });

      this.sockets.forEach((socket) => void socket.end());
    });
  }

  private onConnection(socket: Socket): void {
    const packetSocket = new PacketSocket(this.packetMapper, socket);

    this.sockets.add(packetSocket);

    packetSocket.on('close', () => {
      this.sockets.delete(packetSocket);
    });

    void this.emit('connection', packetSocket);
  }

  private addListeners(): void {
    this.server.on('connection', this.onConnection.bind(this));
    this.server.on('listening', () => void this.emit('listening'));
    this.server.on('close', () => {
      void this.emit('close');
    });
    /* istanbul ignore next - unable to test */
    this.server.on('error', (error) => void this.emit('error', error));
    /* istanbul ignore next - unable to test */
    this.server.on('drop', (data) => void this.emit('drop', data));
  }
}
