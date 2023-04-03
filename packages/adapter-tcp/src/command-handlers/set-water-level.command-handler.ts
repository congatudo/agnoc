import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { DeviceWaterLevelMapper } from '../mappers/device-water-level.mapper';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { CommandHandler, ConnectionWithDevice, DeviceRepository, SetWaterLevelCommand } from '@agnoc/domain';

export class SetWaterLevelCommandHandler implements CommandHandler {
  readonly forName = 'SetWaterLevelCommand';

  constructor(
    private readonly packetConnectionFinderService: PacketConnectionFinderService,
    private readonly deviceWaterLevelMapper: DeviceWaterLevelMapper,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async handle(event: SetWaterLevelCommand): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      return;
    }

    await this.setWaterLevel(event, connection);
    await this.updateDevice(event, connection);
  }

  private async setWaterLevel(
    { waterLevel }: SetWaterLevelCommand,
    connection: PacketConnection & ConnectionWithDevice,
  ) {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_SET_CLEAN_PREFERENCE_REQ', {
      mode: this.deviceWaterLevelMapper.fromDomain(waterLevel),
    });

    response.assertPayloadName('DEVICE_SET_CLEAN_PREFERENCE_RSP');
  }

  private async updateDevice(
    { waterLevel }: SetWaterLevelCommand,
    connection: PacketConnection & ConnectionWithDevice,
  ) {
    connection.device.updateWaterLevel(waterLevel);

    await this.deviceRepository.saveOne(connection.device);
  }
}
