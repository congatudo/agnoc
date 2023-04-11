import type { PacketEventHandler } from '../base-classes/packet.event-handler';
import type { PacketMessage } from '../objects/packet.message';

export class DeviceUpgradeInfoEventHandler implements PacketEventHandler {
  readonly forName = 'PUSH_DEVICE_PACKAGE_UPGRADE_INFO_REQ';

  async handle(message: PacketMessage<'PUSH_DEVICE_PACKAGE_UPGRADE_INFO_REQ'>): Promise<void> {
    // TODO: save device ota info

    await message.respond('PUSH_DEVICE_PACKAGE_UPGRADE_INFO_RSP', { result: 0 });
  }
}
