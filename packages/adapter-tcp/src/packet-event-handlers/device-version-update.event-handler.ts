import { DeviceVersion } from '@agnoc/domain';
import { DomainException } from '@agnoc/toolkit';
import type { PacketEventHandler } from '../packet.event-handler';
import type { PacketMessage } from '../packet.message';

export class DeviceVersionUpdateEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_VERSION_INFO_UPDATE_REQ';

  async handle(message: PacketMessage<'DEVICE_VERSION_INFO_UPDATE_REQ'>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

    const data = message.packet.payload.object;

    message.device.updateVersion(new DeviceVersion({ software: data.softwareVersion, hardware: data.hardwareVersion }));

    // TODO: save entity and publish domain event

    await message.respond('DEVICE_VERSION_INFO_UPDATE_RSP', { result: 0 });
  }
}
