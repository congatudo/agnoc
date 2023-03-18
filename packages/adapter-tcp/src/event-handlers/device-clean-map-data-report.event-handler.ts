import type { PacketEventHandler, PacketEventHandleParameter } from '../packet.event-handler';

export class DeviceCleanMapDataReportEventHandler implements PacketEventHandler {
  eventName = 'DEVICE_CLEANMAP_BINDATA_REPORT_REQ' as const;

  async handle(message: PacketEventHandleParameter<this>): Promise<void> {
    const data = message.packet.payload.object;

    await message.respond('DEVICE_CLEANMAP_BINDATA_REPORT_RSP', { result: 0, cleanId: data.cleanId });
  }
}
