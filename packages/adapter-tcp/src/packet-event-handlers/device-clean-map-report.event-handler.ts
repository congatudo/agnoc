import type { PacketEventHandler } from '../packet.event-handler';
import type { PacketMessage } from '../packet.message';

export class DeviceCleanMapReportEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_EVENT_REPORT_CLEANMAP';

  async handle(message: PacketMessage<'DEVICE_EVENT_REPORT_CLEANMAP'>): Promise<void> {
    const data = message.packet.payload.data;

    // TODO: save device clean map data

    await message.respond('DEVICE_EVENT_REPORT_RSP', { result: 0, body: { cleanId: data.cleanId } });
  }
}
