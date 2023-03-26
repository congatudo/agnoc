import type { PacketEventHandler } from '../packet.event-handler';
import type { PacketMessage } from '../packet.message';

export class DeviceMemoryMapInfoEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_MAPID_PUSH_ALL_MEMORY_MAP_INFO';

  async handle(_: PacketMessage<'DEVICE_MAPID_PUSH_ALL_MEMORY_MAP_INFO'>): Promise<void> {
    // TODO: save device memory map info
  }
}
