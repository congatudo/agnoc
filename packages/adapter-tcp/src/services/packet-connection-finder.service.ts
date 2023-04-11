import { DomainException } from '@agnoc/toolkit';
import { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { ConnectionRepository, Connection, ConnectionWithDevice } from '@agnoc/domain';
import type { ID } from '@agnoc/toolkit';

export class PacketConnectionFinderService {
  constructor(private readonly connectionRepository: ConnectionRepository) {}

  async findByDeviceId(deviceId: ID): Promise<(PacketConnection & ConnectionWithDevice) | undefined> {
    const connections = await this.connectionRepository.findByDeviceId(deviceId);

    if (connections.length === 0) {
      throw new DomainException(`Unable to find a connection for the device with id ${deviceId.value}`);
    }

    return connections.find((connection: Connection): connection is PacketConnection & ConnectionWithDevice =>
      PacketConnection.isPacketConnection(connection),
    );
  }
}
