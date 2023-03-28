import { DeviceCapability } from '@agnoc/domain';
import type { PacketConnectionFinderService } from '../packet-connection-finder.service';
import type { DeviceLockedDomainEvent, DomainEventHandler } from '@agnoc/domain';

export class QueryDeviceInfoWhenDeviceIsLockedEventHandler implements DomainEventHandler {
  readonly forName = 'DeviceLockedDomainEvent';

  constructor(private readonly packetConnectionFinderService: PacketConnectionFinderService) {}

  async handle(event: DeviceLockedDomainEvent): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.aggregateId);

    if (!connection) {
      return;
    }

    await connection.send('DEVICE_ORDERLIST_GETTING_REQ', {});
    await connection.send('DEVICE_STATUS_GETTING_REQ', {});
    await connection.send('DEVICE_GET_ALL_GLOBAL_MAP_INFO_REQ', { unk1: 0, unk2: '' });

    // TODO: move this to a get time service.
    await connection.send('DEVICE_GETTIME_REQ', {});

    // TODO: move this to a get map service.
    await connection.send('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', {
      mask: connection.device?.system.supports(DeviceCapability.MAP_PLANS) ? 0x78ff : 0xff,
    });

    // TODO: move this to a get network service.
    await connection.send('DEVICE_WLAN_INFO_GETTING_REQ', {});
  }
}
