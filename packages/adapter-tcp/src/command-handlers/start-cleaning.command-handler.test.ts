import {
  DeviceMap,
  DeviceMode,
  DeviceModeValue,
  DeviceState,
  DeviceStateValue,
  MapPosition,
  StartCleaningCommand,
} from '@agnoc/domain';
import { givenSomeDeviceMapProps } from '@agnoc/domain/test-support';
import { DomainException, ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { ModeCtrlValue } from '../services/device-mode-changer.service';
import { StartCleaningCommandHandler } from './start-cleaning.command-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { DeviceCleaningService } from '../services/device-cleaning.service';
import type { DeviceMapService } from '../services/device-map.service';
import type { DeviceModeChangerService } from '../services/device-mode-changer.service';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { ConnectionWithDevice, Device, DeviceSystem } from '@agnoc/domain';

describe('StartCleaningCommandHandler', function () {
  let deviceCleaningService: DeviceCleaningService;
  let deviceMapService: DeviceMapService;
  let packetConnectionFinderService: PacketConnectionFinderService;
  let deviceModeChangerService: DeviceModeChangerService;
  let commandHandler: StartCleaningCommandHandler;
  let packetConnection: PacketConnection & ConnectionWithDevice;
  let device: Device;
  let deviceSystem: DeviceSystem;

  beforeEach(function () {
    deviceCleaningService = imock();
    deviceMapService = imock();
    packetConnectionFinderService = imock();
    deviceModeChangerService = imock();
    commandHandler = new StartCleaningCommandHandler(
      instance(packetConnectionFinderService),
      instance(deviceModeChangerService),
      instance(deviceCleaningService),
      instance(deviceMapService),
    );
    packetConnection = imock();
    device = imock();
    deviceSystem = imock();
  });

  it('should define the name', function () {
    expect(commandHandler.forName).to.be.equal('StartCleaningCommand');
  });

  describe('#handle()', function () {
    it('should do nothing when no connection is found', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await commandHandler.handle(command);

      verify(deviceModeChangerService.changeMode(anything(), anything())).never();
      verify(deviceCleaningService.autoCleaning(anything(), anything())).never();
    });

    it('should start auto cleaning', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.system).thenReturn(instance(deviceSystem));
      when(deviceSystem.supports(anything())).thenReturn(false);
      when(device.mode).thenReturn(undefined);
      when(device.hasMopAttached).thenReturn(false);

      await commandHandler.handle(command);

      verify(
        deviceModeChangerService.changeMode(
          instance(packetConnection),
          deepEqual(new DeviceMode(DeviceModeValue.None)),
        ),
      ).once();
      verify(deviceCleaningService.autoCleaning(instance(packetConnection), ModeCtrlValue.Start)).once();
    });

    it('should enable whole clean when supported', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });
      const deviceMap = new DeviceMap(givenSomeDeviceMapProps());

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.system).thenReturn(instance(deviceSystem));
      when(deviceSystem.supports(anything())).thenReturn(true);
      when(device.mode).thenReturn(undefined);
      when(device.state).thenReturn(new DeviceState(DeviceStateValue.Docked));
      when(device.hasMopAttached).thenReturn(false);
      when(device.map).thenReturn(deviceMap);

      await commandHandler.handle(command);

      verify(
        deviceModeChangerService.changeMode(
          instance(packetConnection),
          deepEqual(new DeviceMode(DeviceModeValue.None)),
        ),
      ).once();
      verify(
        deviceMapService.enableWholeClean(
          instance(packetConnection) as PacketConnection & ConnectionWithDevice<DeviceWithMap>,
        ),
      ).once();
      verify(deviceCleaningService.autoCleaning(instance(packetConnection), ModeCtrlValue.Start)).once();
    });

    it('should not enable whole clean when device has no map', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.system).thenReturn(instance(deviceSystem));
      when(deviceSystem.supports(anything())).thenReturn(true);
      when(device.mode).thenReturn(undefined);
      when(device.state).thenReturn(new DeviceState(DeviceStateValue.Docked));
      when(device.hasMopAttached).thenReturn(false);
      when(device.map).thenReturn(undefined);

      await commandHandler.handle(command);

      verify(
        deviceModeChangerService.changeMode(
          instance(packetConnection),
          deepEqual(new DeviceMode(DeviceModeValue.None)),
        ),
      ).once();
      verify(deviceMapService.enableWholeClean(anything())).never();
      verify(deviceCleaningService.autoCleaning(instance(packetConnection), ModeCtrlValue.Start)).once();
    });

    it('should start zone cleaning', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Zone));
      when(device.hasMopAttached).thenReturn(false);

      await commandHandler.handle(command);

      verify(
        deviceModeChangerService.changeMode(
          instance(packetConnection),
          deepEqual(new DeviceMode(DeviceModeValue.None)),
        ),
      ).once();
      verify(deviceCleaningService.zoneCleaning(instance(packetConnection), ModeCtrlValue.Start)).once();
    });

    it('should start mop cleaning', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Mop));
      when(device.hasMopAttached).thenReturn(true);

      await commandHandler.handle(command);

      verify(
        deviceModeChangerService.changeMode(instance(packetConnection), deepEqual(new DeviceMode(DeviceModeValue.Mop))),
      ).once();
      verify(deviceCleaningService.mopCleaning(instance(packetConnection), ModeCtrlValue.Start)).once();
    });

    it('should start spot cleaning', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });
      const currentSpot = new MapPosition({ x: 0, y: 0, phi: 0 });
      const deviceMap = new DeviceMap({
        ...givenSomeDeviceMapProps(),
        currentSpot,
      });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Spot));
      when(device.hasMopAttached).thenReturn(false);
      when(device.map).thenReturn(deviceMap);

      await commandHandler.handle(command);

      verify(
        deviceModeChangerService.changeMode(
          instance(packetConnection),
          deepEqual(new DeviceMode(DeviceModeValue.None)),
        ),
      ).once();
      verify(deviceCleaningService.spotCleaning(instance(packetConnection), currentSpot, ModeCtrlValue.Start)).once();
    });

    it('should throw an error when trying to spot clean without map', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Spot));
      when(device.hasMopAttached).thenReturn(false);
      when(device.map).thenReturn(undefined);

      await expect(commandHandler.handle(command)).to.be.rejectedWith(
        DomainException,
        'Unable to start spot cleaning, no map available',
      );
    });

    it('should throw an error when trying to spot clean without current spot', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });
      const deviceMap = new DeviceMap({
        ...givenSomeDeviceMapProps(),
        currentSpot: undefined,
      });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Spot));
      when(device.hasMopAttached).thenReturn(false);
      when(device.map).thenReturn(deviceMap);

      await expect(commandHandler.handle(command)).to.be.rejectedWith(
        DomainException,
        'Unable to start spot cleaning, no spot selected',
      );
    });
  });
});

interface DeviceWithMap extends Device {
  map: DeviceMap;
}
