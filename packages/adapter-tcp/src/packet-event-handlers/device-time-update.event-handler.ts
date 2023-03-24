import type { PacketEventHandler } from '../packet.event-handler';
import type { PacketMessage } from '../packet.message';

export class DeviceTimeUpdateEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_GETTIME_RSP';

  async handle(_: PacketMessage<'DEVICE_GETTIME_RSP'>): Promise<void> {
    // TODO: Should do something here?
  }
}
