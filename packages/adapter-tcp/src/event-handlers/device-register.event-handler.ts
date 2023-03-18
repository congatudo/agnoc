import { Device, DeviceSystem, DeviceVersion } from '@agnoc/domain';
import { ID } from '@agnoc/toolkit';
import type { PacketEventHandler, PacketEventHandleParameter } from '../packet.event-handler';
import type { DeviceRepository } from '@agnoc/domain';

export class DeviceRegisterEventHandler implements PacketEventHandler {
  eventName = 'DEVICE_REGISTER_REQ' as const;

  constructor(private readonly deviceRepository: DeviceRepository) {}

  async handle(message: PacketEventHandleParameter<this>): Promise<void> {
    const data = message.packet.payload.object;
    const device = new Device({
      id: ID.generate(),
      userId: ID.generate(),
      system: new DeviceSystem({ type: data.deviceType, serialNumber: data.deviceSerialNumber }),
      version: new DeviceVersion({ software: data.softwareVersion, hardware: data.hardwareVersion }),
    });

    await this.deviceRepository.saveOne(device);

    const response = { result: 0, device: { id: device.id.value } };

    await message.respond('DEVICE_REGISTER_RSP', response);
  }
}
