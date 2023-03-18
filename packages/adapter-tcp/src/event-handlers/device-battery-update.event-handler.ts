import { DomainException } from '@agnoc/toolkit';
import type { DeviceBatteryMapper } from '../mappers/device-battery.mapper';
import type { PacketEventHandler, PacketEventHandleParameter } from '../packet.event-handler';

export class DeviceBatteryUpdateEventHandler implements PacketEventHandler {
  eventName = 'PUSH_DEVICE_BATTERY_INFO_REQ' as const;

  constructor(private readonly deviceBatteryMapper: DeviceBatteryMapper) {}

  async handle(message: PacketEventHandleParameter<this>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

    const data = message.packet.payload.object;

    message.device.updateBattery(this.deviceBatteryMapper.toDomain(data.battery.level));

    await message.respond('PUSH_DEVICE_BATTERY_INFO_RSP', { result: 0 });
  }
}
