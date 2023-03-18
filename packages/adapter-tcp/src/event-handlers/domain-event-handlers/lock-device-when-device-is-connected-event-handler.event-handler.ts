import { DomainException } from '@agnoc/toolkit';
import type { ConnectionManager } from '../../connection.manager';
import type { DomainEventHandler, DeviceConnectedDomainEvent } from '@agnoc/domain';

export class LockDeviceWhenDeviceIsConnectedEventHandler implements DomainEventHandler {
  readonly eventName = 'DeviceConnectedDomainEvent';

  constructor(private readonly connectionManager: ConnectionManager) {}

  handle(event: DeviceConnectedDomainEvent): Promise<void> {
    const [connection] = this.connectionManager.findConnectionsByDeviceId(event.aggregateId);

    if (!connection) {
      throw new DomainException(`Unable to find a connection for the device with id ${event.aggregateId.value}`);
    }

    return connection.send('DEVICE_CONTROL_LOCK_REQ', {});
  }
}
