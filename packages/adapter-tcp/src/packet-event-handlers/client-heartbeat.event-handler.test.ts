import { deepEqual, imock, instance, verify } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { ClientHeartbeatEventHandler } from './client-heartbeat.event-handler';
import type { PacketMessage } from '../objects/packet.message';

describe('ClientHeartbeatEventHandler', function () {
  let eventHandler: ClientHeartbeatEventHandler;
  let packetMessage: PacketMessage<'CLIENT_HEARTBEAT_REQ'>;

  beforeEach(function () {
    eventHandler = new ClientHeartbeatEventHandler();
    packetMessage = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('CLIENT_HEARTBEAT_REQ');
  });

  describe('#handle()', function () {
    it('should respond to the message', async function () {
      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.respond('CLIENT_HEARTBEAT_RSP', deepEqual({}))).once();
    });
  });
});
