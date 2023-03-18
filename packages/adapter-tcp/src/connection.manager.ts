import { DomainException } from '@agnoc/toolkit';
import { DeviceConnection } from './device.connection';
import { PacketMessage } from './packet.message';
import type { PacketEventBus, PacketEventBusEvents } from './packet.event-bus';
import type { DeviceRepository, Device } from '@agnoc/domain';
import type { ID } from '@agnoc/toolkit';
import type { PacketServer, PacketFactory, Packet, PayloadObjectName } from '@agnoc/transport-tcp';

export class ConnectionManager {
  private readonly connections = new Set<DeviceConnection>();

  constructor(
    private readonly servers: PacketServer[],
    private readonly packetEventBus: PacketEventBus,
    private readonly packetFactory: PacketFactory,
    private readonly deviceRepository: DeviceRepository,
  ) {
    this.addListeners();
  }

  findConnectionsByDeviceId(deviceId: ID): DeviceConnection[] {
    return [...this.connections].filter((connection) => connection.device?.id.equals(deviceId));
  }

  private addListeners() {
    this.servers.forEach((server) => {
      server.on('connection', (socket) => {
        const connection = new DeviceConnection(this.packetFactory, socket);

        this.connections.add(connection);

        connection.on('data', async (packet: Packet) => {
          const event = packet.payload.opcode.name as PayloadObjectName;
          const packetMessage = new PacketMessage(connection, packet) as PacketEventBusEvents[PayloadObjectName];

          // Update the device on the connection if the device id has changed.
          if (!packet.deviceId.equals(connection.device?.id)) {
            connection.device = await this.findDeviceById(packet.deviceId);
          }

          const count = this.packetEventBus.listenerCount(event);

          if (count === 0) {
            throw new DomainException(`No event handler found for packet event '${event}'`);
          }

          await this.packetEventBus.emit(event, packetMessage);
        });

        connection.on('close', () => {
          connection.removeAllListeners();
          this.connections.delete(connection);
        });
      });
    });
  }

  private async findDeviceById(id: ID): Promise<Device | undefined> {
    if (id.value === 0) {
      return undefined;
    }

    return this.deviceRepository.findOneById(id);
  }
}
