import { DomainException } from '@agnoc/toolkit';
import type { PackerServerConnectionHandler } from '../../packet-server.connection-handler';
import type { CommandHandler, LocateDeviceCommand } from '@agnoc/domain';

export class LocateDeviceEventHandler implements CommandHandler {
  readonly forName = 'LocateDeviceCommand';

  constructor(private readonly connectionManager: PackerServerConnectionHandler) {}

  async handle(event: LocateDeviceCommand): Promise<void> {
    const [connection] = this.connectionManager.findConnectionsByDeviceId(event.deviceId);

    if (!connection || !connection.device) {
      throw new DomainException(`Unable to find a connection for the device with id ${event.deviceId.value}`);
    }

    const response = await connection.sendAndWait('DEVICE_SEEK_LOCATION_REQ', {});

    if (response.packet.payload.opcode.value !== 'DEVICE_SEEK_LOCATION_RSP') {
      throw new DomainException(`Unexpected response from device: ${response.packet.payload.opcode.value}`);
    }
  }
}
