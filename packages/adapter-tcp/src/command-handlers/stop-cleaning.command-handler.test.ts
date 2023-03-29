import { StopCleaningCommand } from '@agnoc/domain';
import { ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { StopCleaningCommandHandler } from './stop-cleaning.command-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { ConnectionWithDevice } from '@agnoc/domain';

describe('StopCleaningCommandHandler', function () {
  let packetConnectionFinderService: PacketConnectionFinderService;
  let commandHandler: StopCleaningCommandHandler;
  let packetConnection: PacketConnection & ConnectionWithDevice;
  let packetMessage: PacketMessage;

  beforeEach(function () {
    packetConnectionFinderService = imock();
    commandHandler = new StopCleaningCommandHandler(instance(packetConnectionFinderService));
    packetConnection = imock();
    packetMessage = imock();
  });

  it('should define the name', function () {
    expect(commandHandler.forName).to.be.equal('StopCleaningCommand');
  });

  describe('#handle()', function () {
    it('should do nothing when no connection is found', async function () {
      const command = new StopCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait(anything(), anything())).never();
      verify(packetMessage.assertPayloadName(anything())).never();
    });

    it('should stop cleaning', async function () {
      const command = new StopCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait('DEVICE_AUTO_CLEAN_REQ', deepEqual({ ctrlValue: 0, cleanType: 2 }))).once();
      verify(packetMessage.assertPayloadName('DEVICE_AUTO_CLEAN_RSP')).once();
    });
  });
});
