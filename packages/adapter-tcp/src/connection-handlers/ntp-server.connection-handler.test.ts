import { ID } from '@agnoc/toolkit';
import { Packet } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import {
  anything,
  capture,
  deepEqual,
  defer,
  greaterThanOrEqual,
  imock,
  instance,
  verify,
  when,
} from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { NTPServerConnectionHandler } from './ntp-server.connection-handler';
import type { PacketServer, PacketFactory, PacketSocket } from '@agnoc/transport-tcp';

describe('TimeSyncServer', function () {
  let packetServer: PacketServer;
  let packetFactory: PacketFactory;
  let packetSocket: PacketSocket;
  let rtpPacketServer: NTPServerConnectionHandler;

  beforeEach(function () {
    packetServer = imock();
    packetFactory = imock();
    packetSocket = imock();
    rtpPacketServer = new NTPServerConnectionHandler(instance(packetFactory));
  });

  describe('#register()', function () {
    it('should register servers that handles connections', async function () {
      const packet = new Packet(givenSomePacketProps());
      const now = Math.floor(Date.now() / 1000);
      const onClose = defer();

      when(packetFactory.create(anything(), anything(), anything())).thenReturn(packet);
      when(packetServer.once(anything())).thenReturn(onClose);

      rtpPacketServer.register(instance(packetServer));

      verify(packetServer.on('connection', anything())).once();

      const [event, handler] = capture(packetServer.on<'connection'>).first();

      expect(event).to.be.equal('connection');

      await handler(instance(packetSocket));

      verify(
        packetFactory.create(
          'DEVICE_TIME_SYNC_RSP',
          deepEqual({ result: 0, body: { time: greaterThanOrEqual(now) } }),
          deepEqual({ userId: new ID(0), deviceId: new ID(0) }),
        ),
      ).once();
      verify(packetSocket.end(packet)).once();
    });

    it('should clean up listeners when the server is closed', async function () {
      const onClose = defer();

      when(packetServer.once(anything())).thenReturn(onClose);

      rtpPacketServer.register(instance(packetServer));

      const [, handler] = capture(packetServer.on<'connection'>).first();

      await onClose.resolve(undefined);

      verify(packetServer.off('connection', handler)).once();
    });
  });
});
