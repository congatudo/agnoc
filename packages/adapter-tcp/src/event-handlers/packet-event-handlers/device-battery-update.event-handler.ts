import { DomainException } from '@agnoc/toolkit';
import type { DeviceBatteryMapper } from '../../mappers/device-battery.mapper';
import type { PacketEventHandler } from '../../packet.event-handler';
import type { PacketMessage } from '../../packet.message';

export class DeviceBatteryUpdateEventHandler implements PacketEventHandler {
  readonly eventName = 'PUSH_DEVICE_BATTERY_INFO_REQ';

  constructor(private readonly deviceBatteryMapper: DeviceBatteryMapper) {}

  async handle(message: PacketMessage<'PUSH_DEVICE_BATTERY_INFO_REQ'>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

    const data = message.packet.payload.object;

    message.device.updateBattery(this.deviceBatteryMapper.toDomain(data.battery.level));

    await message.respond('PUSH_DEVICE_BATTERY_INFO_RSP', { result: 0 });
  }
}
