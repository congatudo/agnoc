import type { PacketEventHandler, PacketEventHandleParameter } from '../packet.event-handler';

export class DeviceCleanMapReportEventHandler implements PacketEventHandler {
  eventName = 'DEVICE_EVENT_REPORT_CLEANMAP' as const;

  async handle(message: PacketEventHandleParameter<this>): Promise<void> {
    const data = message.packet.payload.object;

    await message.respond('DEVICE_EVENT_REPORT_RSP', { result: 0, body: { cleanId: data.cleanId } });
  }
}
