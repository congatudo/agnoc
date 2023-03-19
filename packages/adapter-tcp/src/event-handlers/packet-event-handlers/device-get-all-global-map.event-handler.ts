import { DomainException } from '@agnoc/toolkit';
import type { PacketEventHandler } from '../../packet.event-handler';
import type { PacketMessage } from '../../packet.message';

export class DeviceGetAllGlobalMapEventHandler implements PacketEventHandler {
  readonly eventName = 'DEVICE_GET_ALL_GLOBAL_MAP_INFO_RSP';

  async handle(message: PacketMessage<'DEVICE_GET_ALL_GLOBAL_MAP_INFO_RSP'>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

    // TODO: investigate the meaning of this packet.
  }
}
