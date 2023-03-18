import type { PacketEventHandler, PacketEventHandleParameter } from '../packet.event-handler';

export class DeviceCleanTaskReportEventHandler implements PacketEventHandler {
  eventName = 'DEVICE_EVENT_REPORT_CLEANTASK' as const;

  async handle(message: PacketEventHandleParameter<this>): Promise<void> {
    await message.respond('UNK_11A4', { unk1: 0 });
  }
}
