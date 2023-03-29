import type { PacketEventHandler } from '../base-classes/packet.event-handler';
import type { PacketMessage } from '../objects/packet.message';

export class DeviceCleanMapDataReportEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_CLEANMAP_BINDATA_REPORT_REQ';

  async handle(message: PacketMessage<'DEVICE_CLEANMAP_BINDATA_REPORT_REQ'>): Promise<void> {
    const data = message.packet.payload.data;

    // TODO: save device clean map data

    await message.respond('DEVICE_CLEANMAP_BINDATA_REPORT_RSP', { result: 0, cleanId: data.cleanId });
  }
}
