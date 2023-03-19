import { DeviceWlan } from '@agnoc/domain';
import { DomainException } from '@agnoc/toolkit';
import type { PacketEventHandler } from '../../packet.event-handler';
import type { PacketMessage } from '../../packet.message';

export class DeviceWlanUpdateEventHandler implements PacketEventHandler {
  readonly eventName = 'DEVICE_WLAN_INFO_GETTING_RSP';

  async handle(message: PacketMessage<'DEVICE_WLAN_INFO_GETTING_RSP'>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

    const data = message.packet.payload.object.body;

    message.device.updateWlan(
      new DeviceWlan({
        ipv4: data.ipv4,
        ssid: data.ssid,
        port: data.port,
        mask: data.mask,
        mac: data.mac,
      }),
    );

    // TODO: save entity and publish domain event
  }
}
