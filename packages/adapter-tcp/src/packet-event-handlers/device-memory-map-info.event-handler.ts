import { DomainException } from '@agnoc/toolkit';
import type { PacketEventHandler } from '../packet.event-handler';
import type { PacketMessage } from '../packet.message';

export class DeviceMemoryMapInfoEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_MAPID_PUSH_ALL_MEMORY_MAP_INFO';

  async handle(message: PacketMessage<'DEVICE_MAPID_PUSH_ALL_MEMORY_MAP_INFO'>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

    // TODO: save device memory map info
  }
}
