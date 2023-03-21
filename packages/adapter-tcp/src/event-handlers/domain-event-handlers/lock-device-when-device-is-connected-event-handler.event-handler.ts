import { DomainException } from '@agnoc/toolkit';
import { PacketConnection } from '../../aggregate-roots/packet-connection.aggregate-root';
import type { DomainEventHandler, DeviceConnectedDomainEvent, ConnectionRepository, Connection } from '@agnoc/domain';

export class LockDeviceWhenDeviceIsConnectedEventHandler implements DomainEventHandler {
  readonly forName = 'DeviceConnectedDomainEvent';

  constructor(private readonly connectionRepository: ConnectionRepository) {}

  async handle(event: DeviceConnectedDomainEvent): Promise<void> {
    const connections = await this.connectionRepository.findByDeviceId(event.aggregateId);

    if (connections.length === 0) {
      throw new DomainException(`Unable to find a connection for the device with id ${event.aggregateId.value}`);
    }

    const connection = connections.find((connection: Connection): connection is PacketConnection =>
      PacketConnection.isPacketConnection(connection),
    );

    if (!connection) {
      return;
    }

    await connection.send('DEVICE_CONTROL_LOCK_REQ', {});
  }
}
