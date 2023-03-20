import { DomainException } from '@agnoc/toolkit';
import type { PacketEventHandler } from '../../packet.event-handler';
import type { PacketMessage } from '../../packet.message';

export class DeviceLocatedEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_SEEK_LOCATION_RSP';

  async handle(message: PacketMessage<'DEVICE_SEEK_LOCATION_RSP'>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

    // TODO: Should do something here?
  }
}
