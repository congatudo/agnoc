import { DomainException } from '@agnoc/toolkit';
import type { PacketEventHandler } from '../../packet.event-handler';
import type { PacketMessage } from '../../packet.message';

export class DeviceOfflineEventHandler implements PacketEventHandler {
  readonly eventName = 'DEVICE_OFFLINE_CMD';

  async handle(message: PacketMessage<'DEVICE_OFFLINE_CMD'>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

    return message.connection.send('DEVICE_CONTROL_LOCK_REQ', {});
  }
}
