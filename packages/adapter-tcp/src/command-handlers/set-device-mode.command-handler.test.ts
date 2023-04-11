import { DeviceMode, DeviceModeValue, SetDeviceModeCommand } from '@agnoc/domain';
import { ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { SetDeviceModeCommandHandler } from './set-device-mode.command-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { DeviceModeChangerService } from '../services/device-mode-changer.service';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { ConnectionWithDevice } from '@agnoc/domain';

describe('SetDeviceModeCommandHandler', function () {
  let deviceModeChangerService: DeviceModeChangerService;
  let packetConnectionFinderService: PacketConnectionFinderService;
  let commandHandler: SetDeviceModeCommandHandler;
  let packetConnection: PacketConnection & ConnectionWithDevice;

  beforeEach(function () {
    deviceModeChangerService = imock();
    packetConnectionFinderService = imock();
    commandHandler = new SetDeviceModeCommandHandler(
      instance(packetConnectionFinderService),
      instance(deviceModeChangerService),
    );
    packetConnection = imock();
  });

  it('should define the name', function () {
    expect(commandHandler.forName).to.be.equal('SetDeviceModeCommand');
  });

  describe('#handle()', function () {
    it('should change and set device mode', async function () {
      const mode = new DeviceMode(DeviceModeValue.Mop);
      const command = new SetDeviceModeCommand({ deviceId: new ID(1), mode });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));

      await commandHandler.handle(command);

      verify(deviceModeChangerService.changeMode(instance(packetConnection), mode)).once();
    });

    it('should do nothing when no connection is found', async function () {
      const mode = new DeviceMode(DeviceModeValue.Mop);
      const command = new SetDeviceModeCommand({ deviceId: new ID(1), mode });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await commandHandler.handle(command);

      verify(deviceModeChangerService.changeMode(anything(), anything())).never();
    });
  });
});
