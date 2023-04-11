import { DomainException } from '@agnoc/toolkit';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type {
  CommandHandler,
  ConnectionWithDevice,
  Device,
  DeviceRepository,
  DeviceSettings,
  SetCarpetModeCommand,
} from '@agnoc/domain';

export class SetCarpetModeCommandHandler implements CommandHandler {
  readonly forName = 'SetCarpetModeCommand';

  constructor(
    private readonly packetConnectionFinderService: PacketConnectionFinderService,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async handle(event: SetCarpetModeCommand): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      return;
    }

    this.assertDeviceSettings(connection);

    await this.sendCarpetMode(event, connection);
    await this.updateDeviceSettings(event, connection);
  }

  private assertDeviceSettings(
    connection: PacketConnection & ConnectionWithDevice<Device>,
  ): asserts connection is PacketConnection & ConnectionWithDevice<DeviceWithSettings> {
    if (!connection.device.settings) {
      throw new DomainException('Unable to set voice setting when device settings are not available');
    }
  }

  private async updateDeviceSettings(
    { carpetMode }: SetCarpetModeCommand,
    connection: PacketConnection & ConnectionWithDevice<DeviceWithSettings>,
  ) {
    const settings = connection.device.settings.clone({ carpetMode });

    connection.device.updateSettings(settings);

    await this.deviceRepository.saveOne(connection.device);
  }

  private async sendCarpetMode(
    { carpetMode }: SetCarpetModeCommand,
    connection: PacketConnection & ConnectionWithDevice,
  ) {
    const response: PacketMessage = await connection.sendAndWait('USER_SET_DEVICE_CLEANPREFERENCE_REQ', {
      carpetTurbo: carpetMode.isEnabled,
    });

    response.assertPayloadName('USER_SET_DEVICE_CLEANPREFERENCE_RSP');
  }
}

interface DeviceWithSettings extends Device {
  settings: DeviceSettings;
}
