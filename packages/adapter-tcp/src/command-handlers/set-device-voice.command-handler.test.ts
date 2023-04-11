import { DeviceSettings, SetDeviceVoiceCommand, VoiceSetting } from '@agnoc/domain';
import { givenSomeDeviceSettingsProps } from '@agnoc/domain/test-support';
import { DomainException, ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { SetDeviceVoiceCommandHandler } from './set-device-voice.command-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { VoiceSettingMapper } from '../mappers/voice-setting.mapper';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { ConnectionWithDevice, DeviceRepository, Device } from '@agnoc/domain';

describe('SetDeviceVoiceCommandHandler', function () {
  let voiceSettingMapper: VoiceSettingMapper;
  let deviceRepository: DeviceRepository;
  let packetConnectionFinderService: PacketConnectionFinderService;
  let commandHandler: SetDeviceVoiceCommandHandler;
  let packetConnection: PacketConnection & ConnectionWithDevice;
  let packetMessage: PacketMessage;
  let device: Device;

  beforeEach(function () {
    voiceSettingMapper = imock();
    deviceRepository = imock();
    packetConnectionFinderService = imock();
    commandHandler = new SetDeviceVoiceCommandHandler(
      instance(packetConnectionFinderService),
      instance(voiceSettingMapper),
      instance(deviceRepository),
    );
    packetConnection = imock();
    packetMessage = imock();
    device = imock();
  });

  it('should define the name', function () {
    expect(commandHandler.forName).to.be.equal('SetDeviceVoiceCommand');
  });

  describe('#handle()', function () {
    it('should change and set voice setting', async function () {
      const voice = { isEnabled: true, volume: 5 };
      const voiceSetting = new VoiceSetting({ isEnabled: true, volume: 50 });
      const deviceSettings = new DeviceSettings(givenSomeDeviceSettingsProps());
      const command = new SetDeviceVoiceCommand({
        deviceId: new ID(1),
        voice: voiceSetting,
      });

      when(voiceSettingMapper.fromDomain(anything())).thenReturn(voice);
      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.settings).thenReturn(deviceSettings);

      await commandHandler.handle(command);

      verify(voiceSettingMapper.fromDomain(command.voice)).once();
      verify(
        packetConnection.sendAndWait('USER_SET_DEVICE_CTRL_SETTING_REQ', deepEqual({ voiceMode: true, volume: 5 })),
      ).once();
      verify(packetMessage.assertPayloadName('USER_SET_DEVICE_CTRL_SETTING_RSP')).once();
      verify(
        device.updateSettings(
          deepEqual(new DeviceSettings({ ...givenSomeDeviceSettingsProps(), voice: voiceSetting })),
        ),
      ).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should do nothing when no connection is found', async function () {
      const voiceSetting = new VoiceSetting({ isEnabled: true, volume: 50 });
      const command = new SetDeviceVoiceCommand({
        deviceId: new ID(1),
        voice: voiceSetting,
      });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait(anything(), anything())).never();
      verify(packetMessage.assertPayloadName(anything())).never();
      verify(device.updateSettings(anything())).never();
      verify(deviceRepository.saveOne(anything())).never();
    });

    it('should throw an error when device has no settings', async function () {
      const voiceSetting = new VoiceSetting({ isEnabled: true, volume: 50 });
      const command = new SetDeviceVoiceCommand({
        deviceId: new ID(1),
        voice: voiceSetting,
      });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.settings).thenReturn(undefined);

      await expect(commandHandler.handle(command)).to.be.rejectedWith(
        DomainException,
        'Unable to set voice setting when device settings are not available',
      );

      verify(packetConnection.sendAndWait(anything(), anything())).never();
      verify(packetMessage.assertPayloadName(anything())).never();
      verify(device.updateSettings(anything())).never();
      verify(deviceRepository.saveOne(anything())).never();
    });
  });
});
