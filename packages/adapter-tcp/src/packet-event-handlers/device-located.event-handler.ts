import type { PacketEventHandler } from '../base-classes/packet.event-handler';
import type { PacketMessage } from '../objects/packet.message';

export class DeviceLocatedEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_SEEK_LOCATION_RSP';

  async handle(_: PacketMessage<'DEVICE_SEEK_LOCATION_RSP'>): Promise<void> {
    // TODO: Should do something here?
  }
}
