import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { DeviceFanSpeedMapper } from '../mappers/device-fan-speed.mapper';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { CommandHandler, ConnectionWithDevice, DeviceRepository, SetFanSpeedCommand } from '@agnoc/domain';

export class SetFanSpeedCommandHandler implements CommandHandler {
  readonly forName = 'SetFanSpeedCommand';

  constructor(
    private readonly packetConnectionFinderService: PacketConnectionFinderService,
    private readonly deviceFanSpeedMapper: DeviceFanSpeedMapper,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async handle(event: SetFanSpeedCommand): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      return;
    }

    await this.setFanSpeed(event, connection);
    await this.updateDevice(event, connection);
  }

  private async setFanSpeed({ fanSpeed }: SetFanSpeedCommand, connection: PacketConnection & ConnectionWithDevice) {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_SET_CLEAN_PREFERENCE_REQ', {
      mode: this.deviceFanSpeedMapper.fromDomain(fanSpeed),
    });

    response.assertPayloadName('DEVICE_SET_CLEAN_PREFERENCE_RSP');
  }

  private async updateDevice({ fanSpeed }: SetFanSpeedCommand, connection: PacketConnection & ConnectionWithDevice) {
    connection.device.updateFanSpeed(fanSpeed);

    await this.deviceRepository.saveOne(connection.device);
  }
}
