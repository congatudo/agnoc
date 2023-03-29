import { ID } from '@agnoc/toolkit';
import { PacketMessage } from '../objects/packet.message';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketConnectionFactory } from '../factories/connection.factory';
import type { ConnectionDeviceUpdaterService } from '../services/connection-device-updater.service';
import type { PacketEventPublisherService } from '../services/packet-event-publisher.service';
import type { ConnectionRepository } from '@agnoc/domain';
import type { PacketServer, Packet, PacketSocket } from '@agnoc/transport-tcp';

export class PackerServerConnectionHandler {
  private readonly servers = new Map<PacketServer, Set<PacketConnection>>();

  constructor(
    private readonly connectionRepository: ConnectionRepository,
    private readonly packetConnectionFactory: PacketConnectionFactory,
    private readonly updateConnectionDeviceService: ConnectionDeviceUpdaterService,
    private readonly packetEventPublisherService: PacketEventPublisherService,
  ) {}

  register(...servers: PacketServer[]): void {
    servers.forEach((server) => {
      this.servers.set(server, new Set());
      this.addListeners(server);
    });
  }

  private addListeners(server: PacketServer) {
    const onConnection = (socket: PacketSocket) => this.handleServerConnection(server, socket);

    server.on('connection', onConnection);

    void server.once('close').then(() => {
      server.off('connection', onConnection);

      return this.handleServerClose(server);
    });
  }

  private async handleServerClose(server: PacketServer) {
    const connections = this.servers.get(server) as Set<PacketConnection>;

    this.servers.delete(server);

    await Promise.all([...connections].map((connection) => connection.close()));
  }

  private async handleServerConnection(server: PacketServer, socket: PacketSocket) {
    const connection = this.packetConnectionFactory.create({ id: ID.generate(), socket });

    this.servers.get(server)?.add(connection);

    // Should this be done before or after registering the listeners?
    await this.connectionRepository.saveOne(connection);

    const onData = (packet: Packet) => this.handleConnectionData(connection, packet);
    const onClose = () => {
      connection.socket.off('data', onData);
      this.servers.get(server)?.delete(connection);
      return this.connectionRepository.deleteOne(connection);
    };

    connection.socket.on('data', onData);
    connection.socket.once('close', onClose);
  }

  private async handleConnectionData(connection: PacketConnection, packet: Packet) {
    const packetMessage = new PacketMessage(connection, packet);

    // Update the device on the connection if the device id has changed.
    await this.updateConnectionDeviceService.updateFromPacket(packet, connection);

    // Send the packet message to the packet event bus.
    await this.packetEventPublisherService.publishPacketMessage(packetMessage);
  }
}
