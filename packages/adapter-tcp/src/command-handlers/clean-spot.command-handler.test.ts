import { CleanSpotCommand, DeviceMode, DeviceModeValue, MapCoordinate, MapPosition } from '@agnoc/domain';
import { ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { ModeCtrlValue } from '../services/device-mode-changer.service';
import { CleanSpotCommandHandler } from './clean-spot.command-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { DeviceCleaningService } from '../services/device-cleaning.service';
import type { DeviceModeChangerService } from '../services/device-mode-changer.service';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { ConnectionWithDevice } from '@agnoc/domain';

describe('CleanSpotCommandHandler', function () {
  let deviceModeChangerService: DeviceModeChangerService;
  let deviceCleaningService: DeviceCleaningService;
  let packetConnectionFinderService: PacketConnectionFinderService;
  let commandHandler: CleanSpotCommandHandler;
  let packetConnection: PacketConnection & ConnectionWithDevice;

  beforeEach(function () {
    deviceModeChangerService = imock();
    deviceCleaningService = imock();
    packetConnectionFinderService = imock();
    commandHandler = new CleanSpotCommandHandler(
      instance(packetConnectionFinderService),
      instance(deviceModeChangerService),
      instance(deviceCleaningService),
    );
    packetConnection = imock();
  });

  it('should define the name', function () {
    expect(commandHandler.forName).to.be.equal('CleanSpotCommand');
  });

  describe('#handle()', function () {
    it('should do nothing when no connection is found', async function () {
      const command = new CleanSpotCommand({ deviceId: new ID(1), spot: new MapCoordinate({ x: 1, y: 2 }) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await commandHandler.handle(command);

      verify(deviceModeChangerService.changeMode(anything(), anything())).never();
      verify(deviceCleaningService.spotCleaning(anything(), anything(), anything())).never();
    });

    it('should clean a spot', async function () {
      const command = new CleanSpotCommand({ deviceId: new ID(1), spot: new MapCoordinate({ x: 1, y: 2 }) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));

      await commandHandler.handle(command);

      verify(
        deviceModeChangerService.changeMode(
          instance(packetConnection),
          deepEqual(new DeviceMode(DeviceModeValue.Spot)),
        ),
      ).once();
      verify(
        deviceCleaningService.spotCleaning(
          instance(packetConnection),
          deepEqual(new MapPosition({ x: 1, y: 2, phi: 0 })),
          ModeCtrlValue.Start,
        ),
      ).once();
    });
  });
});
