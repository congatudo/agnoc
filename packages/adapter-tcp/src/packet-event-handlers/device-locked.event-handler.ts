import type { PacketEventHandler } from '../base-classes/packet.event-handler';
import type { PacketMessage } from '../objects/packet.message';
import type { DeviceRepository } from '@agnoc/domain';

export class DeviceLockedEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_CONTROL_LOCK_RSP';

  constructor(private readonly deviceRepository: DeviceRepository) {}

  async handle(message: PacketMessage<'DEVICE_CONTROL_LOCK_RSP'>): Promise<void> {
    message.assertDevice();

    if (!message.device.isLocked) {
      message.device.setAsLocked();

      await this.deviceRepository.saveOne(message.device);
    }
  }
}
