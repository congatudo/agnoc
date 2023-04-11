import { CleanZonesCommand, DeviceMode, DeviceModeValue, MapCoordinate, Zone } from '@agnoc/domain';
import { DomainException, ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { ModeCtrlValue } from '../services/device-mode-changer.service';
import { CleanZonesCommandHandler } from './clean-zones.command-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { DeviceCleaningService } from '../services/device-cleaning.service';
import type { DeviceMapService } from '../services/device-map.service';
import type { DeviceModeChangerService } from '../services/device-mode-changer.service';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { ConnectionWithDevice, Device, DeviceMap } from '@agnoc/domain';

describe('CleanZonesCommandHandler', function () {
  let deviceMapService: DeviceMapService;
  let deviceModeChangerService: DeviceModeChangerService;
  let deviceCleaningService: DeviceCleaningService;
  let packetConnectionFinderService: PacketConnectionFinderService;
  let commandHandler: CleanZonesCommandHandler;
  let packetConnection: PacketConnection & ConnectionWithDevice<DeviceWithMap>;
  let device: Device;
  let deviceMap: DeviceMap;

  beforeEach(function () {
    deviceMapService = imock();
    deviceModeChangerService = imock();
    deviceCleaningService = imock();
    packetConnectionFinderService = imock();
    commandHandler = new CleanZonesCommandHandler(
      instance(packetConnectionFinderService),
      instance(deviceModeChangerService),
      instance(deviceMapService),
      instance(deviceCleaningService),
    );
    packetConnection = imock();
    device = imock();
    deviceMap = imock();
  });

  it('should define the name', function () {
    expect(commandHandler.forName).to.be.equal('CleanZonesCommand');
  });

  describe('#handle()', function () {
    it('should do nothing when no connection is found', async function () {
      const zone = new Zone({ id: new ID(1), coordinates: [new MapCoordinate({ x: 1, y: 2 })] });
      const command = new CleanZonesCommand({ deviceId: new ID(1), zones: [zone] });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await commandHandler.handle(command);

      verify(deviceModeChangerService.changeMode(anything(), anything())).never();
      verify(deviceMapService.setMapZones(anything(), anything())).never();
      verify(deviceCleaningService.zoneCleaning(anything(), anything())).never();
    });

    it('should clean zones', async function () {
      const zone = new Zone({ id: new ID(1), coordinates: [new MapCoordinate({ x: 1, y: 2 })] });
      const command = new CleanZonesCommand({ deviceId: new ID(1), zones: [zone] });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device) as DeviceWithMap);
      when(device.map).thenReturn(instance(deviceMap));

      await commandHandler.handle(command);

      verify(
        deviceModeChangerService.changeMode(
          instance(packetConnection),
          deepEqual(new DeviceMode(DeviceModeValue.Zone)),
        ),
      ).once();
      verify(deviceMapService.setMapZones(instance(packetConnection), deepEqual([zone]))).once();
      verify(deviceCleaningService.zoneCleaning(instance(packetConnection), ModeCtrlValue.Start)).once();
    });

    it('should throw an error when device has no map', async function () {
      const zone = new Zone({ id: new ID(1), coordinates: [new MapCoordinate({ x: 1, y: 2 })] });
      const command = new CleanZonesCommand({ deviceId: new ID(1), zones: [zone] });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(instance(device) as DeviceWithMap);
      when(device.map).thenReturn(undefined);

      await expect(commandHandler.handle(command)).to.be.rejectedWith(
        DomainException,
        'Unable to clean zones without a device with a map',
      );

      verify(deviceModeChangerService.changeMode(anything(), anything())).never();
      verify(deviceMapService.setMapZones(anything(), anything())).never();
      verify(deviceCleaningService.zoneCleaning(anything(), anything())).never();
    });
  });
});

interface DeviceWithMap extends Device {
  map: DeviceMap;
}
