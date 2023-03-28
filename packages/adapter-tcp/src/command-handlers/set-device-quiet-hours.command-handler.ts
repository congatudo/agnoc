import type { PacketConnectionFinderService } from '../packet-connection-finder.service';
import type { PacketMessage } from '../packet.message';
import type { CommandHandler, SetDeviceQuietHoursCommand } from '@agnoc/domain';

export class SetDeviceQuietHoursCommandHandler implements CommandHandler {
  readonly forName = 'SetDeviceQuietHoursCommand';

  constructor(private readonly packetConnectionFinderService: PacketConnectionFinderService) {}

  async handle(event: SetDeviceQuietHoursCommand): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      return;
    }

    const response: PacketMessage = await connection.sendAndWait('USER_SET_DEVICE_QUIETHOURS_REQ', {
      isOpen: event.quietHours.isEnabled,
      beginTime: event.quietHours.beginTime.toMinutes(),
      endTime: event.quietHours.endTime.toMinutes(),
    });

    response.assertPayloadName('USER_SET_DEVICE_QUIETHOURS_RSP');
  }
}
