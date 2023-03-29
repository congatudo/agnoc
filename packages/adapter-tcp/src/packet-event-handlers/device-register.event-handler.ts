import { Device, DeviceBattery, DeviceBatteryMaxValue, DeviceSystem, DeviceVersion } from '@agnoc/domain';
import { ID } from '@agnoc/toolkit';
import type { PacketEventHandler } from '../base-classes/packet.event-handler';
import type { PacketMessage } from '../objects/packet.message';
import type { DeviceRepository } from '@agnoc/domain';

export class DeviceRegisterEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_REGISTER_REQ';

  constructor(private readonly deviceRepository: DeviceRepository) {}

  async handle(message: PacketMessage<'DEVICE_REGISTER_REQ'>): Promise<void> {
    const data = message.packet.payload.data;
    const device = new Device({
      id: ID.generate(),
      userId: ID.generate(),
      system: new DeviceSystem({ type: data.deviceType, serialNumber: data.deviceSerialNumber }),
      version: new DeviceVersion({ software: data.softwareVersion, hardware: data.hardwareVersion }),
      battery: new DeviceBattery(DeviceBatteryMaxValue),
      isConnected: false,
      isLocked: false,
    });

    await this.deviceRepository.saveOne(device);

    const response = { result: 0, device: { id: device.id.value } };

    await message.respond('DEVICE_REGISTER_RSP', response);
  }
}
