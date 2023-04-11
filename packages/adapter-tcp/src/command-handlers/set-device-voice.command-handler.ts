import { DomainException } from '@agnoc/toolkit';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { VoiceSettingMapper } from '../mappers/voice-setting.mapper';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type {
  CommandHandler,
  ConnectionWithDevice,
  Device,
  DeviceRepository,
  DeviceSettings,
  SetDeviceVoiceCommand,
} from '@agnoc/domain';

export class SetDeviceVoiceCommandHandler implements CommandHandler {
  readonly forName = 'SetDeviceVoiceCommand';

  constructor(
    private readonly packetConnectionFinderService: PacketConnectionFinderService,
    private readonly voiceSettingMapper: VoiceSettingMapper,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async handle(event: SetDeviceVoiceCommand): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      return;
    }

    this.assertDeviceSettings(connection);

    await this.sendDeviceVoice(event, connection);
    await this.updateDeviceSettings(connection, event);
  }

  private assertDeviceSettings(
    connection: PacketConnection & ConnectionWithDevice<Device>,
  ): asserts connection is PacketConnection & ConnectionWithDevice<DeviceWithSettings> {
    if (!connection.device.settings) {
      throw new DomainException('Unable to set voice setting when device settings are not available');
    }
  }

  private async updateDeviceSettings(
    connection: PacketConnection & ConnectionWithDevice<DeviceWithSettings>,
    event: SetDeviceVoiceCommand,
  ) {
    const settings = connection.device.settings.clone({ voice: event.voice });

    connection.device.updateSettings(settings);

    await this.deviceRepository.saveOne(connection.device);
  }

  private async sendDeviceVoice(event: SetDeviceVoiceCommand, connection: PacketConnection & ConnectionWithDevice) {
    const { isEnabled, volume } = this.voiceSettingMapper.fromDomain(event.voice);

    const response: PacketMessage = await connection.sendAndWait('USER_SET_DEVICE_CTRL_SETTING_REQ', {
      voiceMode: isEnabled,
      volume,
    });

    response.assertPayloadName('USER_SET_DEVICE_CTRL_SETTING_RSP');
  }
}

interface DeviceWithSettings extends Device {
  settings: DeviceSettings;
}
