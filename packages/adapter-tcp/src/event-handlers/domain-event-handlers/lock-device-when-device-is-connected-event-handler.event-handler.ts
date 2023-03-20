import { DomainException } from '@agnoc/toolkit';
import type { PackerServerConnectionHandler } from '../../packet-server.connection-handler';
import type { DomainEventHandler, DeviceConnectedDomainEvent } from '@agnoc/domain';

export class LockDeviceWhenDeviceIsConnectedEventHandler implements DomainEventHandler {
  readonly forName = 'DeviceConnectedDomainEvent';

  constructor(private readonly connectionManager: PackerServerConnectionHandler) {}

  async handle(event: DeviceConnectedDomainEvent): Promise<void> {
    const [connection] = this.connectionManager.findConnectionsByDeviceId(event.aggregateId);

    if (!connection) {
      throw new DomainException(`Unable to find a connection for the device with id ${event.aggregateId.value}`);
    }

    await connection.send('DEVICE_CONTROL_LOCK_REQ', {});
  }
}
