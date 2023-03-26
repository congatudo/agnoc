import { DeviceVersion } from '@agnoc/domain';
import type { PacketEventHandler } from '../packet.event-handler';
import type { PacketMessage } from '../packet.message';
import type { DeviceRepository } from '@agnoc/domain';

export class DeviceVersionUpdateEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_VERSION_INFO_UPDATE_REQ';

  constructor(private readonly deviceRepository: DeviceRepository) {}

  async handle(message: PacketMessage<'DEVICE_VERSION_INFO_UPDATE_REQ'>): Promise<void> {
    message.assertDevice();

    const data = message.packet.payload.data;

    message.device.updateVersion(new DeviceVersion({ software: data.softwareVersion, hardware: data.hardwareVersion }));

    await this.deviceRepository.saveOne(message.device);

    await message.respond('DEVICE_VERSION_INFO_UPDATE_RSP', { result: 0 });
  }
}
