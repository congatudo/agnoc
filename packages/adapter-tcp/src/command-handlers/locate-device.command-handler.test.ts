import { LocateDeviceCommand } from '@agnoc/domain';
import { ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { LocateDeviceCommandHandler } from './locate-device.command-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { ConnectionWithDevice } from '@agnoc/domain';

describe('LocateDeviceCommandHandler', function () {
  let packetConnectionFinderService: PacketConnectionFinderService;
  let commandHandler: LocateDeviceCommandHandler;
  let packetConnection: PacketConnection & ConnectionWithDevice;
  let packetMessage: PacketMessage;

  beforeEach(function () {
    packetConnectionFinderService = imock();
    commandHandler = new LocateDeviceCommandHandler(instance(packetConnectionFinderService));
    packetConnection = imock();
    packetMessage = imock();
  });

  it('should define the name', function () {
    expect(commandHandler.forName).to.be.equal('LocateDeviceCommand');
  });

  describe('#handle()', function () {
    it('should send locate device command', async function () {
      const command = new LocateDeviceCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait('DEVICE_SEEK_LOCATION_REQ', deepEqual({}))).once();
      verify(packetMessage.assertPayloadName('DEVICE_SEEK_LOCATION_RSP')).once();
    });

    it('should do nothing when no connection is found', async function () {
      const command = new LocateDeviceCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait(anything(), anything())).never();
      verify(packetMessage.assertPayloadName(anything())).never();
    });
  });
});
