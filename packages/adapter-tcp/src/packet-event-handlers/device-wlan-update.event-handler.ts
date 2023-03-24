import { DeviceWlan } from '@agnoc/domain';
import type { PacketEventHandler } from '../packet.event-handler';
import type { PacketMessage } from '../packet.message';
import type { DeviceRepository } from '@agnoc/domain';

export class DeviceWlanUpdateEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_WLAN_INFO_GETTING_RSP';

  constructor(private readonly deviceRepository: DeviceRepository) {}

  async handle(message: PacketMessage<'DEVICE_WLAN_INFO_GETTING_RSP'>): Promise<void> {
    message.assertDevice();

    const data = message.packet.payload.data.body;

    message.device.updateWlan(
      new DeviceWlan({
        ipv4: data.ipv4,
        ssid: data.ssid,
        port: data.port,
        mask: data.mask,
        mac: data.mac,
      }),
    );

    await this.deviceRepository.saveOne(message.device);
  }
}
