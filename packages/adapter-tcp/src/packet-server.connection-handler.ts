import { DomainException, ID } from '@agnoc/toolkit';
import { PacketMessage } from './packet.message';
import type { PacketConnection } from './aggregate-roots/packet-connection.aggregate-root';
import type { PacketConnectionFactory } from './factories/connection.factory';
import type { PacketEventBus, PacketEventBusEvents } from './packet.event-bus';
import type { DeviceRepository, Device, Connection, ConnectionRepository } from '@agnoc/domain';
import type { PacketServer, Packet, PayloadDataName } from '@agnoc/transport-tcp';

export class PackerServerConnectionHandler {
  private readonly servers = new Map<PacketServer, Set<PacketConnection>>();

  constructor(
    private readonly packetEventBus: PacketEventBus,
    private readonly deviceRepository: DeviceRepository,
    private readonly connectionRepository: ConnectionRepository,
    private readonly packetConnectionFactory: PacketConnectionFactory,
  ) {}

  addServers(...servers: PacketServer[]): void {
    servers.forEach((server) => {
      this.servers.set(server, new Set());
      this.addListeners(server);
    });
  }

  private addListeners(server: PacketServer) {
    server.on('connection', (socket) => {
      const connection = this.packetConnectionFactory.create({ id: ID.generate(), socket });

      this.servers.get(server)?.add(connection);

      connection.socket.on('data', async (packet: Packet) => {
        const packetMessage = new PacketMessage(connection, packet);

        // Update the device on the connection if the device id has changed.
        await this.updateConnectionDevice(packet, connection);

        // Send the packet message to the packet event bus.
        await this.emitPacketEvent(packetMessage);
      });

      connection.socket.on('close', () => {
        this.servers.get(server)?.delete(connection);
      });
    });

    server.on('close', async () => {
      const connections = this.servers.get(server);

      if (connections) {
        await Promise.all([...connections].map((connection) => connection.close()));

        this.servers.delete(server);
      }
    });
  }

  private async emitPacketEvent(message: PacketMessage<PayloadDataName>) {
    const name = message.packet.payload.opcode.name as PayloadDataName;
    const sequence = message.packet.sequence.toString();

    this.checkForPacketEventHandler(name);

    // Emit the packet event by the sequence string.
    // This is used to wait for a response from a packet.
    await this.packetEventBus.emit(sequence, message as PacketEventBusEvents[PayloadDataName]);

    // Emit the packet event by the opcode name.
    await this.packetEventBus.emit(name, message as PacketEventBusEvents[PayloadDataName]);
  }

  private checkForPacketEventHandler(event: PayloadDataName) {
    const count = this.packetEventBus.listenerCount(event);

    // Throw an error if there is no event handler for the packet event.
    if (count === 0) {
      throw new DomainException(`No event handler found for packet event '${event}'`);
    }
  }

  private async updateConnectionDevice(packet: Packet, connection: Connection) {
    if (!packet.deviceId.equals(connection.device?.id)) {
      const device = await this.findDeviceById(packet.deviceId);

      connection.setDevice(device);

      await this.connectionRepository.saveOne(connection);
    }
  }

  private async findDeviceById(id: ID): Promise<Device | undefined> {
    if (id.value === 0) {
      return undefined;
    }

    return this.deviceRepository.findOneById(id);
  }
}
