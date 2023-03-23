import { DeviceSetting, DeviceSettings, DeviceTime, QuietHoursSetting } from '@agnoc/domain';
import { DomainException } from '@agnoc/toolkit';
import type { VoiceSettingMapper } from '../mappers/voice-setting.mapper';
import type { PacketEventHandler } from '../packet.event-handler';
import type { PacketMessage } from '../packet.message';

export class DeviceSettingsUpdateEventHandler implements PacketEventHandler {
  readonly forName = 'PUSH_DEVICE_AGENT_SETTING_REQ';

  constructor(private readonly deviceVoiceMapper: VoiceSettingMapper) {}

  async handle(message: PacketMessage<'PUSH_DEVICE_AGENT_SETTING_REQ'>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

    const data = message.packet.payload.data;
    const deviceSettings = new DeviceSettings({
      voice: this.deviceVoiceMapper.toDomain({
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

    message.device.updateConfig(deviceSettings);

    // TODO: save entity and publish domain event

    await message.respond('PUSH_DEVICE_AGENT_SETTING_RSP', { result: 0 });
  }
}
