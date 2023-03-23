import type { PacketConnection } from './aggregate-roots/packet-connection.aggregate-root';
import type { ConnectionRepository, DeviceRepository, Device } from '@agnoc/domain';
import type { ID } from '@agnoc/toolkit';
import type { Packet } from '@agnoc/transport-tcp';

export class ConnectionDeviceUpdaterService {
  constructor(
    private readonly connectionRepository: ConnectionRepository,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async updateFromPacket(packet: Packet, connection: PacketConnection): Promise<void> {
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
