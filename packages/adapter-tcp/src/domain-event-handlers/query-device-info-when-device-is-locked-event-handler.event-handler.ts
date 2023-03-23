import { DeviceCapability } from '@agnoc/domain';
import { DomainException } from '@agnoc/toolkit';
import { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { DeviceLockedDomainEvent, DomainEventHandler, Connection, ConnectionRepository } from '@agnoc/domain';

export class QueryDeviceInfoWhenDeviceIsLockedEventHandler implements DomainEventHandler {
  readonly forName = 'DeviceLockedDomainEvent';

  constructor(private readonly connectionRepository: ConnectionRepository) {}

  async handle(event: DeviceLockedDomainEvent): Promise<void> {
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

    await connection.send('DEVICE_STATUS_GETTING_REQ', {});
    await connection.send('DEVICE_GET_ALL_GLOBAL_MAP_INFO_REQ', { unk1: 0, unk2: '' });

    // TODO: move this to a get time service.
    await connection.send('DEVICE_GETTIME_REQ', {});

    // TODO: move this to a get map service.
    await connection.send('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', {
      mask: connection.device?.system.supports(DeviceCapability.MAP_PLANS) ? 0x78ff : 0xff,
    });

    // TODO: move this to a get wlan service.
    await connection.send('DEVICE_WLAN_INFO_GETTING_REQ', {});
  }
}
