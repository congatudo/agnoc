import { DomainException } from '@agnoc/toolkit';
import type { PacketEventHandler } from '../packet.event-handler';
import type { PacketMessage } from '../packet.message';

export class DeviceTimeUpdateEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_GETTIME_RSP';

  async handle(message: PacketMessage<'DEVICE_GETTIME_RSP'>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

    // TODO: save device time
    // {
    //   timestamp: object.body.deviceTime * 1000,
    //   offset: -1 * ((object.body.deviceTimezone || 0) / 60),
    // };
  }
}
