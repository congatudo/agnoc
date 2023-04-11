import { DeviceMap, DeviceMode, DeviceModeValue, MapPosition, PauseCleaningCommand } from '@agnoc/domain';
import { givenSomeDeviceMapProps } from '@agnoc/domain/test-support';
import { DomainException, ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { ModeCtrlValue } from '../services/device-mode-changer.service';
import { PauseCleaningCommandHandler } from './pause-cleaning.command-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { DeviceCleaningService } from '../services/device-cleaning.service';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { ConnectionWithDevice, Device } from '@agnoc/domain';

describe('PauseCleaningCommandHandler', function () {
  let deviceCleaningService: DeviceCleaningService;
  let packetConnectionFinderService: PacketConnectionFinderService;
  let commandHandler: PauseCleaningCommandHandler;
  let packetConnection: PacketConnection & ConnectionWithDevice;
  let device: Device;

  beforeEach(function () {
    deviceCleaningService = imock();
    packetConnectionFinderService = imock();
    commandHandler = new PauseCleaningCommandHandler(
      instance(packetConnectionFinderService),
      instance(deviceCleaningService),
    );
    packetConnection = imock();
    device = imock();
  });

  it('should define the name', function () {
    expect(commandHandler.forName).to.be.equal('PauseCleaningCommand');
  });

  describe('#handle()', function () {
    it('should do nothing when no connection is found', async function () {
      const command = new PauseCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await commandHandler.handle(command);

      verify(deviceCleaningService.autoCleaning(anything(), anything())).never();
    });

    it('should pause auto cleaning', async function () {
      const command = new PauseCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(undefined);

      await commandHandler.handle(command);

      verify(deviceCleaningService.autoCleaning(instance(packetConnection), ModeCtrlValue.Pause));
    });

    it('should pause zone cleaning', async function () {
      const command = new PauseCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Zone));

      await commandHandler.handle(command);

      verify(deviceCleaningService.zoneCleaning(instance(packetConnection), ModeCtrlValue.Pause));
    });

    it('should pause mop cleaning', async function () {
      const command = new PauseCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Mop));

      await commandHandler.handle(command);

      verify(deviceCleaningService.mopCleaning(instance(packetConnection), ModeCtrlValue.Pause));
    });

    it('should pause spot cleaning', async function () {
      const command = new PauseCleaningCommand({ deviceId: new ID(1) });
      const currentSpot = new MapPosition({ x: 0, y: 0, phi: 0 });
      const deviceMap = new DeviceMap({
        ...givenSomeDeviceMapProps(),
        id: new ID(1),
        currentSpot,
      });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Spot));
      when(device.map).thenReturn(deviceMap);

      await commandHandler.handle(command);

      verify(deviceCleaningService.spotCleaning(instance(packetConnection), currentSpot, ModeCtrlValue.Pause));
    });

    it('should throw an error when trying to spot clean without map', async function () {
      const command = new PauseCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Spot));
      when(device.map).thenReturn(undefined);

      await expect(commandHandler.handle(command)).to.be.rejectedWith(
        DomainException,
        'Unable to pause spot cleaning, no map available',
      );
    });

    it('should throw an error when trying to spot clean without current spot', async function () {
      const command = new PauseCleaningCommand({ deviceId: new ID(1) });
      const deviceMap = new DeviceMap({
        ...givenSomeDeviceMapProps(),
        currentSpot: undefined,
      });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Spot));
      when(device.map).thenReturn(deviceMap);

      await expect(commandHandler.handle(command)).to.be.rejectedWith(
        DomainException,
        'Unable to pause spot cleaning, no spot selected',
      );
    });
  });
});
