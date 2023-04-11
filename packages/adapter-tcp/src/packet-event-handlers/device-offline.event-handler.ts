import type { PacketEventHandler } from '../base-classes/packet.event-handler';
import type { PacketMessage } from '../objects/packet.message';

export class DeviceOfflineEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_OFFLINE_CMD';

  async handle(_: PacketMessage<'DEVICE_OFFLINE_CMD'>): Promise<void> {
    // TODO: Should do something here?
  }
}
