import { DeviceFanSpeed, DeviceFanSpeedValue, SetFanSpeedCommand } from '@agnoc/domain';
import { ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { SetFanSpeedCommandHandler } from './set-fan-speed.command-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { DeviceFanSpeedMapper } from '../mappers/device-fan-speed.mapper';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { ConnectionWithDevice, DeviceRepository, Device } from '@agnoc/domain';

describe('SetFanSpeedCommandHandler', function () {
  let deviceFanSpeedMapper: DeviceFanSpeedMapper;
  let deviceRepository: DeviceRepository;
  let packetConnectionFinderService: PacketConnectionFinderService;
  let commandHandler: SetFanSpeedCommandHandler;
  let packetConnection: PacketConnection & ConnectionWithDevice;
  let packetMessage: PacketMessage;
  let device: Device;

  beforeEach(function () {
    deviceFanSpeedMapper = imock();
    deviceRepository = imock();
    packetConnectionFinderService = imock();
    commandHandler = new SetFanSpeedCommandHandler(
      instance(packetConnectionFinderService),
      instance(deviceFanSpeedMapper),
      instance(deviceRepository),
    );
    packetConnection = imock();
    packetMessage = imock();
    device = imock();
  });

  it('should define the name', function () {
    expect(commandHandler.forName).to.be.equal('SetFanSpeedCommand');
  });

  describe('#handle()', function () {
    it('should set the fan speed', async function () {
      const fanSpeed = new DeviceFanSpeed(DeviceFanSpeedValue.Low);
      const command = new SetFanSpeedCommand({ deviceId: new ID(1), fanSpeed });

      when(deviceFanSpeedMapper.fromDomain(anything())).thenReturn(1);
      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait('DEVICE_SET_CLEAN_PREFERENCE_REQ', deepEqual({ mode: 1 }))).once();
      verify(packetMessage.assertPayloadName('DEVICE_SET_CLEAN_PREFERENCE_RSP')).once();
      verify(device.updateFanSpeed(fanSpeed)).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should do nothing when no connection is found', async function () {
      const fanSpeed = new DeviceFanSpeed(DeviceFanSpeedValue.Low);
      const command = new SetFanSpeedCommand({ deviceId: new ID(1), fanSpeed });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait(anything(), anything())).never();
      verify(packetMessage.assertPayloadName(anything())).never();
      verify(device.updateSettings(anything())).never();
      verify(deviceRepository.saveOne(anything())).never();
    });
  });
});
