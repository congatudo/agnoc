import { DomainException } from '@agnoc/toolkit';
import type { PacketEventHandler } from '../packet.event-handler';
import type { PacketMessage } from '../packet.message';

export class DeviceCleanMapDataReportEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_CLEANMAP_BINDATA_REPORT_REQ';

  async handle(message: PacketMessage<'DEVICE_CLEANMAP_BINDATA_REPORT_REQ'>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

    const data = message.packet.payload.object;

    // TODO: save device clean map data

    await message.respond('DEVICE_CLEANMAP_BINDATA_REPORT_RSP', { result: 0, cleanId: data.cleanId });
  }
}
