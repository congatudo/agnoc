import { DeviceSetting, DeviceSettings, DeviceTime, QuietHoursSetting } from '@agnoc/domain';
import { DomainException } from '@agnoc/toolkit';
import type { DeviceVoiceMapper } from '../mappers/device-voice.mapper';
import type { PacketEventHandler, PacketEventHandleParameter } from '../packet.event-handler';

export class DeviceSettingsUpdateEventHandler implements PacketEventHandler {
  eventName = 'PUSH_DEVICE_AGENT_SETTING_REQ' as const;

  constructor(private readonly deviceVoiceMapper: DeviceVoiceMapper) {}

  async handle(message: PacketEventHandleParameter<this>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

    const data = message.packet.payload.object;
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

    await message.respond('PUSH_DEVICE_AGENT_SETTING_RSP', { result: 0 });
  }
}
