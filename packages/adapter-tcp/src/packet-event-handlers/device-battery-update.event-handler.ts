import type { PacketEventHandler } from '../base-classes/packet.event-handler';
import type { DeviceBatteryMapper } from '../mappers/device-battery.mapper';
import type { PacketMessage } from '../objects/packet.message';
import type { DeviceRepository } from '@agnoc/domain';

export class DeviceBatteryUpdateEventHandler implements PacketEventHandler {
  readonly forName = 'PUSH_DEVICE_BATTERY_INFO_REQ';

  constructor(
    private readonly deviceBatteryMapper: DeviceBatteryMapper,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async handle(message: PacketMessage<'PUSH_DEVICE_BATTERY_INFO_REQ'>): Promise<void> {
    message.assertDevice();

    const data = message.packet.payload.data;

    message.device.updateBattery(this.deviceBatteryMapper.toDomain(data.battery.level));

    await this.deviceRepository.saveOne(message.device);

    await message.respond('PUSH_DEVICE_BATTERY_INFO_RSP', { result: 0 });
  }
}
