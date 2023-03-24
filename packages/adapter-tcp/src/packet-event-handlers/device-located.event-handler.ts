import type { PacketEventHandler } from '../packet.event-handler';
import type { PacketMessage } from '../packet.message';

export class DeviceLocatedEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_SEEK_LOCATION_RSP';

  async handle(_: PacketMessage<'DEVICE_SEEK_LOCATION_RSP'>): Promise<void> {
    // TODO: Should do something here?
  }
}
