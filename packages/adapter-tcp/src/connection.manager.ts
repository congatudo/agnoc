import { DomainException } from '@agnoc/toolkit';
import { DeviceConnection } from './device.connection';
import { PacketMessage } from './packet.message';
import type { PacketEventBus, PacketEventBusEvents } from './packet.event-bus';
import type { DeviceRepository, Device } from '@agnoc/domain';
import type { ID } from '@agnoc/toolkit';
import type { PacketServer, PacketFactory, Packet, PayloadObjectName } from '@agnoc/transport-tcp';

export class ConnectionManager {
  private readonly servers = new Map<PacketServer, Set<DeviceConnection>>();

  constructor(
    private readonly packetEventBus: PacketEventBus,
    private readonly packetFactory: PacketFactory,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  findConnectionsByDeviceId(deviceId: ID): DeviceConnection[] {
    const connections = [...this.servers.values()].flatMap((connections) => [...connections]);

    return connections.filter((connection) => connection.device?.id.equals(deviceId));
  }

  addServers(...servers: PacketServer[]): void {
    servers.forEach((server) => {
      this.servers.set(server, new Set());
      this.addListeners(server);
    });
  }

  private addListeners(server: PacketServer) {
    server.on('connection', (socket) => {
      const connection = new DeviceConnection(this.packetFactory, this.packetEventBus, socket);

      this.servers.get(server)?.add(connection);

      connection.on('data', async (packet: Packet) => {
        const packetMessage = new PacketMessage(connection, packet);

        // Update the device on the connection if the device id has changed.
        await this.updateConnectionDevice(packet, connection);

        // Send the packet message to the packet event bus.
        await this.emitPacketEvent(packetMessage);

        // This is a hack to only mark the device as connected if there is more than one connection.
        // Here we should check that the connections are from the same ip address.
        await this.tryToSetDeviceAsConnected(connection);
      });

      connection.on('close', () => {
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

  private async tryToSetDeviceAsConnected(connection: DeviceConnection) {
    if (connection.device && !connection.device.isConnected) {
      const connections = this.findConnectionsByDeviceId(connection.device.id);

      if (connections.length > 1) {
        connection.device.setAsConnected();

        await this.deviceRepository.saveOne(connection.device);
      }
    }
  }

  private async emitPacketEvent(message: PacketMessage<PayloadObjectName>) {
    const name = message.packet.payload.opcode.name as PayloadObjectName;
    const sequence = message.packet.sequence.toString();

    this.checkForPacketEventHandler(name);

    // Emit the packet event by the sequence string.
    // This is used to wait for a response from a packet.
    await this.packetEventBus.emit(sequence, message as PacketEventBusEvents[PayloadObjectName]);

    // Emit the packet event by the opcode name.
    await this.packetEventBus.emit(name, message as PacketEventBusEvents[PayloadObjectName]);
  }

  private checkForPacketEventHandler(event: PayloadObjectName) {
    const count = this.packetEventBus.listenerCount(event);

    // Throw an error if there is no event handler for the packet event.
    if (count === 0) {
      throw new DomainException(`No event handler found for packet event '${event}'`);
    }
  }

  private async updateConnectionDevice(packet: Packet, connection: DeviceConnection) {
    if (!packet.deviceId.equals(connection.device?.id)) {
      connection.device = await this.findDeviceById(packet.deviceId);
    }
  }

  private async findDeviceById(id: ID): Promise<Device | undefined> {
    if (id.value === 0) {
      return undefined;
    }

    return this.deviceRepository.findOneById(id);
  }
}
