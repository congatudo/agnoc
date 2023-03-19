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

          // Throw an error if there is no event handler for the packet event.
          if (count === 0) {
            throw new DomainException(`No event handler found for packet event '${event}'`);
          }

          // Emit the packet event.
          await this.packetEventBus.emit(event, packetMessage);

          // This is a hack to only mark the device as connected if there is more than one connection.
          // Here we should check that the connections are from the same ip address.
          if (connection.device && !connection.device.isConnected) {
            const connections = this.findConnectionsByDeviceId(connection.device.id);

            if (connections.length > 1) {
              connection.device.setAsConnected();

              await this.deviceRepository.saveOne(connection.device);
            }
          }
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
