import type { PacketConnectionFinderService } from '../packet-connection-finder.service';
import type { DomainEventHandler, DeviceConnectedDomainEvent } from '@agnoc/domain';

export class LockDeviceWhenDeviceIsConnectedEventHandler implements DomainEventHandler {
  readonly forName = 'DeviceConnectedDomainEvent';

  constructor(private readonly packetConnectionFinderService: PacketConnectionFinderService) {}

  async handle(event: DeviceConnectedDomainEvent): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.aggregateId);

    if (!connection) {
      return;
    }

    await connection.send('DEVICE_CONTROL_LOCK_REQ', {});
  }
}
