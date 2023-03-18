import { DomainException } from '@agnoc/toolkit';
import type { PacketEventHandler } from '../../packet.event-handler';
import type { PacketMessage } from '../../packet.message';
import type { DeviceRepository } from '@agnoc/domain';

export class DeviceLockedEventHandler implements PacketEventHandler {
  readonly eventName = 'DEVICE_CONTROL_LOCK_RSP';

  constructor(private readonly deviceRepository: DeviceRepository) {}

  async handle(message: PacketMessage<'DEVICE_CONTROL_LOCK_RSP'>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

    message.device.setAsLocked();

    await this.deviceRepository.saveOne(message.device);
  }
}
