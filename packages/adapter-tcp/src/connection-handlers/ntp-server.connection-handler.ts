import { ID } from '@agnoc/toolkit';
import type { PacketServer, PacketFactory, PacketSocket } from '@agnoc/transport-tcp';

/** Handler for NTP server connections. */
export class NTPServerConnectionHandler {
  constructor(private readonly packetFactory: PacketFactory) {}

  /**
   * Register a server to handle connections.
   *
   * This must be done before the server is started.
   */
  register(...servers: PacketServer[]): void {
    servers.forEach((server) => {
      this.addListeners(server);
    });
  }

  private async handleConnection(socket: PacketSocket) {
    const props = { userId: new ID(0), deviceId: new ID(0) };
    const payload = { result: 0, body: { time: Math.floor(Date.now() / 1000) } };
    const packet = this.packetFactory.create('DEVICE_TIME_SYNC_RSP', payload, props);

    return socket.end(packet);
  }

  private addListeners(packetServer: PacketServer) {
    const onConnection = this.handleConnection.bind(this);

    packetServer.on('connection', onConnection);

    void packetServer.once('close').then(() => {
      packetServer.off('connection', onConnection);
    });
  }
}
