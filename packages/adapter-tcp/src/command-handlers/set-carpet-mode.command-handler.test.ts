import { DeviceSetting, DeviceSettings, SetCarpetModeCommand } from '@agnoc/domain';
import { givenSomeDeviceSettingsProps } from '@agnoc/domain/test-support';
import { DomainException, ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { SetCarpetModeCommandHandler } from './set-carpet-mode.command-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { ConnectionWithDevice, DeviceRepository, Device } from '@agnoc/domain';

describe('SetCarpetModeCommandHandler', function () {
  let deviceRepository: DeviceRepository;
  let packetConnectionFinderService: PacketConnectionFinderService;
  let commandHandler: SetCarpetModeCommandHandler;
  let packetConnection: PacketConnection & ConnectionWithDevice;
  let packetMessage: PacketMessage;
  let device: Device;

  beforeEach(function () {
    deviceRepository = imock();
    packetConnectionFinderService = imock();
    commandHandler = new SetCarpetModeCommandHandler(
      instance(packetConnectionFinderService),
      instance(deviceRepository),
    );
    packetConnection = imock();
    packetMessage = imock();
    device = imock();
  });

  it('should define the name', function () {
    expect(commandHandler.forName).to.be.equal('SetCarpetModeCommand');
  });

  describe('#handle()', function () {
    it('should change and set carpet mode', async function () {
      const carpetMode = new DeviceSetting({ isEnabled: true });
      const deviceSettings = new DeviceSettings(givenSomeDeviceSettingsProps());
      const command = new SetCarpetModeCommand({ deviceId: new ID(1), carpetMode });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.settings).thenReturn(deviceSettings);

      await commandHandler.handle(command);

      verify(
        packetConnection.sendAndWait('USER_SET_DEVICE_CLEANPREFERENCE_REQ', deepEqual({ carpetTurbo: true })),
      ).once();
      verify(packetMessage.assertPayloadName('USER_SET_DEVICE_CLEANPREFERENCE_RSP')).once();
      verify(
        device.updateSettings(deepEqual(new DeviceSettings({ ...givenSomeDeviceSettingsProps(), carpetMode }))),
      ).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should do nothing when no connection is found', async function () {
      const carpetMode = new DeviceSetting({ isEnabled: true });
      const command = new SetCarpetModeCommand({ deviceId: new ID(1), carpetMode });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait(anything(), anything())).never();
      verify(packetMessage.assertPayloadName(anything())).never();
      verify(device.updateSettings(anything())).never();
      verify(deviceRepository.saveOne(anything())).never();
    });

    it('should throw an error when device has no settings', async function () {
      const carpetMode = new DeviceSetting({ isEnabled: true });
      const command = new SetCarpetModeCommand({ deviceId: new ID(1), carpetMode });

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
