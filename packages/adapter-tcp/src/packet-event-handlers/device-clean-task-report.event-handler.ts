import type { PacketEventHandler } from '../base-classes/packet.event-handler';
import type { PacketMessage } from '../objects/packet.message';

export class DeviceCleanTaskReportEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_EVENT_REPORT_CLEANTASK';

  async handle(message: PacketMessage<'DEVICE_EVENT_REPORT_CLEANTASK'>): Promise<void> {
    // TODO: save device clean task data

    await message.respond('UNK_11A4', { unk1: 0 });
  }
}
