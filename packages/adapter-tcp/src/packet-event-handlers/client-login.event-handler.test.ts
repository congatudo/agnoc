import { OPCode, Packet, Payload } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { ClientLoginEventHandler } from './client-login.event-handler';
import type { PacketMessage } from '../objects/packet.message';
import type { Device } from '@agnoc/domain';

describe('ClientLoginEventHandler', function () {
  let eventHandler: ClientLoginEventHandler;
  let packetMessage: PacketMessage<'CLIENT_ONLINE_REQ'>;
  let device: Device;

  beforeEach(function () {
    eventHandler = new ClientLoginEventHandler();
    packetMessage = imock();
    device = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('CLIENT_ONLINE_REQ');
  });

  describe('#handle()', function () {
    it('should respond when it has device', async function () {
      when(packetMessage.device).thenReturn(device);

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.respond('CLIENT_ONLINE_RSP', deepEqual({ result: 0 }))).once();
    });

    it('should respond when it does not has device', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('CLIENT_ONLINE_REQ'),
        data: { deviceSerialNumber: '1234567890', unk1: true, unk2: 1 },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.device).thenReturn(undefined);
      when(packetMessage.packet).thenReturn(packet);

      await eventHandler.handle(instance(packetMessage));

      verify(
        packetMessage.respond(
          'CLIENT_ONLINE_RSP',
          deepEqual({ result: 12002, reason: 'Device not registered(devsn: 1234567890)' }),
        ),
      ).once();
    });
  });
});
