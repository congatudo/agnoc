import { DeviceSetting, DeviceSettings, DeviceTime, QuietHoursSetting, VoiceSetting } from '@agnoc/domain';
import { givenSomeVoiceSettingProps } from '@agnoc/domain/test-support';
import { OPCode, Packet, Payload } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { anything, capture, deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceSettingsUpdateEventHandler } from './device-settings-update.event-handler';
import type { VoiceSettingMapper } from '../mappers/voice-setting.mapper';
import type { PacketMessage } from '../packet.message';
import type { Device, DeviceRepository } from '@agnoc/domain';

describe('DeviceSettingsUpdateEventHandler', function () {
  let voiceSettingMapper: VoiceSettingMapper;
  let deviceRepository: DeviceRepository;
  let eventHandler: DeviceSettingsUpdateEventHandler;
  let packetMessage: PacketMessage<'PUSH_DEVICE_AGENT_SETTING_REQ'>;
  let device: Device;

  beforeEach(function () {
    voiceSettingMapper = imock();
    deviceRepository = imock();
    eventHandler = new DeviceSettingsUpdateEventHandler(instance(voiceSettingMapper), instance(deviceRepository));
    packetMessage = imock();
    device = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('PUSH_DEVICE_AGENT_SETTING_REQ');
  });

  describe('#handle()', function () {
    it('should update the device settings', async function () {
      const voiceSetting = new VoiceSetting(givenSomeVoiceSettingProps());
      const payload = new Payload({
        opcode: OPCode.fromName('PUSH_DEVICE_AGENT_SETTING_REQ'),
        data: {
          deviceId: 1,
          voice: {
            voiceMode: true,
            volume: 2,
          },
          quietHours: {
            isOpen: true,
            beginTime: 0,
            endTime: 180,
          },
          cleanPreference: {},
          ota: {
            forceupgrade: false,
            newVersion: false,
            otaPackageVersion: '1.0.0',
            packageSize: '0',
            remoteUrl: '',
            systemVersion: '1.0.0',
          },
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(voiceSettingMapper.toDomain(anything())).thenReturn(voiceSetting);
      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));

      await eventHandler.handle(instance(packetMessage));

      const [deviceSettings] = capture(device.updateSettings).first();

      expect(deviceSettings).to.be.instanceOf(DeviceSettings);
      expect(deviceSettings.voice).to.equal(voiceSetting);
      expect(
        deviceSettings.quietHours.equals(
          new QuietHoursSetting({
            isEnabled: true,
            beginTime: new DeviceTime({ hours: 0, minutes: 0 }),
            endTime: new DeviceTime({ hours: 3, minutes: 0 }),
          }),
        ),
      ).to.be.true;
      expect(deviceSettings.ecoMode.equals(new DeviceSetting({ isEnabled: false }))).to.be.true;
      expect(deviceSettings.repeatClean.equals(new DeviceSetting({ isEnabled: false }))).to.be.true;
      expect(deviceSettings.brokenClean.equals(new DeviceSetting({ isEnabled: false }))).to.be.true;
      expect(deviceSettings.carpetMode.equals(new DeviceSetting({ isEnabled: false }))).to.be.true;
      expect(deviceSettings.historyMap.equals(new DeviceSetting({ isEnabled: false }))).to.be.true;

      verify(packetMessage.assertDevice()).once();
      verify(voiceSettingMapper.toDomain(deepEqual({ isEnabled: true, volume: 2 }))).once();
      verify(device.updateSettings(deviceSettings)).once();
      verify(deviceRepository.saveOne(instance(device))).once();
      verify(packetMessage.respond('PUSH_DEVICE_AGENT_SETTING_RSP', deepEqual({ result: 0 }))).once();
    });

    it('should update the optional values of device settings', async function () {
      const voiceSetting = new VoiceSetting(givenSomeVoiceSettingProps());
      const payload = new Payload({
        opcode: OPCode.fromName('PUSH_DEVICE_AGENT_SETTING_REQ'),
        data: {
          deviceId: 1,
          voice: {
            voiceMode: true,
            volume: 2,
          },
          quietHours: {
            isOpen: true,
            beginTime: 0,
            endTime: 180,
          },
          cleanPreference: {
            ecoMode: true,
            repeatClean: true,
            cleanBroken: true,
            carpetTurbo: true,
            historyMap: true,
          },
          ota: {
            forceupgrade: false,
            newVersion: false,
            otaPackageVersion: '1.0.0',
            packageSize: '0',
            remoteUrl: '',
            systemVersion: '1.0.0',
          },
          taskList: {
            enable: true,
            dayTime: 0,
            orderId: 0,
            repeat: false,
            weekDay: 0,
            cleanInfo: {
              mapHeadId: 0,
              cleanMode: 0,
              planId: 0,
              twiceClean: false,
              windPower: 0,
              waterLevel: 0,
            },
          },
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(voiceSettingMapper.toDomain(anything())).thenReturn(voiceSetting);
      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));

      await eventHandler.handle(instance(packetMessage));

      const [deviceSettings] = capture(device.updateSettings).first();

      expect(deviceSettings).to.be.instanceOf(DeviceSettings);
      expect(deviceSettings.ecoMode.equals(new DeviceSetting({ isEnabled: true }))).to.be.true;
      expect(deviceSettings.repeatClean.equals(new DeviceSetting({ isEnabled: true }))).to.be.true;
      expect(deviceSettings.brokenClean.equals(new DeviceSetting({ isEnabled: true }))).to.be.true;
      expect(deviceSettings.carpetMode.equals(new DeviceSetting({ isEnabled: true }))).to.be.true;
      expect(deviceSettings.historyMap.equals(new DeviceSetting({ isEnabled: true }))).to.be.true;

      verify(packetMessage.assertDevice()).once();
      verify(device.updateSettings(deviceSettings)).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });
  });
});
