import { StopCleaningCommand } from '@agnoc/domain';
import { ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { ModeCtrlValue } from '../services/device-mode-changer.service';
import { StopCleaningCommandHandler } from './stop-cleaning.command-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { DeviceCleaningService } from '../services/device-cleaning.service';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { ConnectionWithDevice } from '@agnoc/domain';

describe('StopCleaningCommandHandler', function () {
  let deviceCleaningService: DeviceCleaningService;
  let packetConnectionFinderService: PacketConnectionFinderService;
  let commandHandler: StopCleaningCommandHandler;
  let packetConnection: PacketConnection & ConnectionWithDevice;

  beforeEach(function () {
    deviceCleaningService = imock();
    packetConnectionFinderService = imock();
    commandHandler = new StopCleaningCommandHandler(
      instance(packetConnectionFinderService),
      instance(deviceCleaningService),
    );
    packetConnection = imock();
  });

  it('should define the name', function () {
    expect(commandHandler.forName).to.be.equal('StopCleaningCommand');
  });

  describe('#handle()', function () {
    it('should do nothing when no connection is found', async function () {
      const command = new StopCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await commandHandler.handle(command);

      verify(deviceCleaningService.autoCleaning(anything(), anything())).never();
    });

    it('should stop cleaning', async function () {
      const command = new StopCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));

      await commandHandler.handle(command);

      verify(deviceCleaningService.autoCleaning(instance(packetConnection), ModeCtrlValue.Stop)).once();
    });
  });
});
