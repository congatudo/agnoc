import type { PacketEventHandler } from '../base-classes/packet.event-handler';
import type { PacketMessage } from '../objects/packet.message';

export class DeviceGetAllGlobalMapEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_GET_ALL_GLOBAL_MAP_INFO_RSP';

  async handle(_: PacketMessage<'DEVICE_GET_ALL_GLOBAL_MAP_INFO_RSP'>): Promise<void> {
    // TODO: investigate the meaning of this packet.
  }
}
