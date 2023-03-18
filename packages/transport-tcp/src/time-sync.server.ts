import { ID } from '@agnoc/toolkit';
import type { PacketFactory } from './factories/packet.factory';
import type { PacketServer } from './packet.server';
import type { PacketSocket } from './packet.socket';

/** Device time synchronization server implementation. */
export class TimeSyncServer {
  constructor(private readonly packetServer: PacketServer, private readonly packetFactory: PacketFactory) {
    this.addListeners();
  }

  /** Start listening for incoming connections. */
  async listen(): Promise<void> {
    return this.packetServer.listen(4050);
  }

  /** Close the server. */
  async close(): Promise<void> {
    return this.packetServer.close();
  }

  private async handleConnection(socket: PacketSocket) {
    const props = { userId: new ID(0), deviceId: new ID(0) };
    const payload = { result: 0, body: { time: Math.floor(Date.now() / 1000) } };
    const packet = this.packetFactory.create('DEVICE_TIME_SYNC_RSP', payload, props);

    return socket.end(packet);
  }

  private addListeners() {
    this.packetServer.on('connection', this.handleConnection.bind(this));
  }
}
