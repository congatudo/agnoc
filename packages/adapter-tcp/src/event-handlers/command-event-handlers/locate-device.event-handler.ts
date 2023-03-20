import { DomainException } from '@agnoc/toolkit';
import type { PackerServerConnectionHandler } from '../../packet-server.connection-handler';
import type { CommandEventHandler, LocateDeviceCommand } from '@agnoc/domain';

export class LocateDeviceEventHandler implements CommandEventHandler {
  readonly eventName = 'LocateDeviceCommand';

  constructor(private readonly connectionManager: PackerServerConnectionHandler) {}

  async handle(event: LocateDeviceCommand): Promise<void> {
    const [connection] = this.connectionManager.findConnectionsByDeviceId(event.deviceId);

    if (!connection || !connection.device) {
      throw new DomainException(`Unable to find a connection for the device with id ${event.deviceId.value}`);
    }

    await connection.sendAndWait('DEVICE_SEEK_LOCATION_REQ', {});
  }
}
