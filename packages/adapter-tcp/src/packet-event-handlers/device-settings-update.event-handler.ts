import { DeviceSetting, DeviceSettings, DeviceTime, QuietHoursSetting } from '@agnoc/domain';
import type { VoiceSettingMapper } from '../mappers/voice-setting.mapper';
import type { PacketEventHandler } from '../packet.event-handler';
import type { PacketMessage } from '../packet.message';
import type { DeviceRepository } from '@agnoc/domain';

export class DeviceSettingsUpdateEventHandler implements PacketEventHandler {
  readonly forName = 'PUSH_DEVICE_AGENT_SETTING_REQ';

  constructor(
    private readonly voiceSettingMapper: VoiceSettingMapper,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async handle(message: PacketMessage<'PUSH_DEVICE_AGENT_SETTING_REQ'>): Promise<void> {
    message.assertDevice();

    const data = message.packet.payload.data;
    const deviceSettings = new DeviceSettings({
      voice: this.voiceSettingMapper.toDomain({
        isEnabled: data.voice.voiceMode,
        volume: data.voice.volume,
      }),
      quietHours: new QuietHoursSetting({
        isEnabled: data.quietHours.isOpen,
        beginTime: DeviceTime.fromMinutes(data.quietHours.beginTime),
        endTime: DeviceTime.fromMinutes(data.quietHours.endTime),
      }),
      ecoMode: new DeviceSetting({ isEnabled: data.cleanPreference.ecoMode ?? false }),
      repeatClean: new DeviceSetting({ isEnabled: data.cleanPreference.repeatClean ?? false }),
      brokenClean: new DeviceSetting({ isEnabled: data.cleanPreference.cleanBroken ?? false }),
      carpetMode: new DeviceSetting({ isEnabled: data.cleanPreference.carpetTurbo ?? false }),
      historyMap: new DeviceSetting({ isEnabled: data.cleanPreference.historyMap ?? false }),
    });

    // TODO: Fields below are unused
    //   - data.deviceId
    //   - data.ota
    //   - data.taskList

    message.device.updateSettings(deviceSettings);

    await this.deviceRepository.saveOne(message.device);

    await message.respond('PUSH_DEVICE_AGENT_SETTING_RSP', { result: 0 });
  }
}
