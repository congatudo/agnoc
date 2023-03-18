import { DeviceVersion } from '@agnoc/domain';
import { DomainException } from '@agnoc/toolkit';
import type { PacketEventHandler, PacketEventHandleParameter } from '../packet.event-handler';

export class DeviceVersionUpdateEventHandler implements PacketEventHandler {
  eventName = 'DEVICE_VERSION_INFO_UPDATE_REQ' as const;

  async handle(message: PacketEventHandleParameter<this>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

    const data = message.packet.payload.object;

    message.device.updateVersion(new DeviceVersion({ software: data.softwareVersion, hardware: data.hardwareVersion }));

    await message.respond('DEVICE_VERSION_INFO_UPDATE_RSP', { result: 0 });
  }
}
