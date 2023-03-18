import { ID } from '@agnoc/toolkit';
import {
  anything,
  capture,
  deepEqual,
  greaterThanOrEqual,
  imock,
  instance,
  verify,
  when,
} from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { givenSomePacketProps } from './test-support';
import { TimeSyncServer } from './time-sync.server';
import { Packet } from './value-objects/packet.value-object';
import type { PacketFactory } from './factories/packet.factory';
import type { PacketServer } from './packet.server';
import type { PacketSocket } from './packet.socket';

describe('TimeSyncServer', function () {
  let packetServer: PacketServer;
  let packetFactory: PacketFactory;
  let packetSocket: PacketSocket;
  let rtpPacketServer: TimeSyncServer;

  beforeEach(function () {
    packetServer = imock();
    packetFactory = imock();
    packetSocket = imock();
    rtpPacketServer = new TimeSyncServer(instance(packetServer), instance(packetFactory));
  });

  it('should handle new connections', async function () {
    const packet = new Packet(givenSomePacketProps());
    const now = Math.floor(Date.now() / 1000);

    when(packetFactory.create(anything(), anything(), anything())).thenReturn(packet);

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

  describe('#listen()', function () {
    it('should listen on port 4050', async function () {
      await rtpPacketServer.listen();

      verify(packetServer.listen(4050)).once();
    });
  });

  describe('#close()', function () {
    it('should close the server', async function () {
      await rtpPacketServer.close();

      verify(packetServer.close()).once();
    });
  });
});
