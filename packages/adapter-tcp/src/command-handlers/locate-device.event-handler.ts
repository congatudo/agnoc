import { DomainException } from '@agnoc/toolkit';
import { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { CommandHandler, Connection, ConnectionRepository, LocateDeviceCommand } from '@agnoc/domain';

export class LocateDeviceEventHandler implements CommandHandler {
  readonly forName = 'LocateDeviceCommand';

  constructor(private readonly connectionRepository: ConnectionRepository) {}

  async handle(event: LocateDeviceCommand): Promise<void> {
    const connections = await this.connectionRepository.findByDeviceId(event.deviceId);

    if (connections.length === 0) {
      throw new DomainException(`Unable to find a connection for the device with id ${event.deviceId.value}`);
    }

    const connection = connections.find((connection: Connection): connection is PacketConnection =>
      PacketConnection.isPacketConnection(connection),
    );

    if (!connection) {
      return;
    }

    const response = await connection.sendAndWait('DEVICE_SEEK_LOCATION_REQ', {});

    if (response.packet.payload.opcode.value !== 'DEVICE_SEEK_LOCATION_RSP') {
      throw new DomainException(`Unexpected response from device: ${response.packet.payload.opcode.value}`);
    }
  }
}
