import { DomainException } from '@agnoc/toolkit';
import type { PacketEventHandler } from '../../packet.event-handler';
import type { PacketMessage } from '../../packet.message';

export class DeviceUpgradeInfoEventHandler implements PacketEventHandler {
  readonly eventName = 'PUSH_DEVICE_PACKAGE_UPGRADE_INFO_REQ';

  async handle(message: PacketMessage<'PUSH_DEVICE_PACKAGE_UPGRADE_INFO_REQ'>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

    // TODO: save device upgrade info

    await message.connection.send('PUSH_DEVICE_PACKAGE_UPGRADE_INFO_RSP', { result: 0 });
  }
}
