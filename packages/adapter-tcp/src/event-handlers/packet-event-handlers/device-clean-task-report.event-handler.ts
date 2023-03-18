import type { PacketEventHandler } from '../../packet.event-handler';
import type { PacketMessage } from '../../packet.message';

export class DeviceCleanTaskReportEventHandler implements PacketEventHandler {
  readonly eventName = 'DEVICE_EVENT_REPORT_CLEANTASK';

  async handle(message: PacketMessage<'DEVICE_EVENT_REPORT_CLEANTASK'>): Promise<void> {
    await message.respond('UNK_11A4', { unk1: 0 });
  }
}
