import { DomainException } from '@agnoc/toolkit';
import { Packet } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { imock, instance, anything, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { PacketMessage } from '../objects/packet.message';
import { PacketEventPublisherService } from './packet-event-publisher.service';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketEventBus } from '../event-buses/packet.event-bus';

describe('PacketEventPublisherService', function () {
  let packetEventBus: PacketEventBus;
  let packetConnection: PacketConnection;
  let service: PacketEventPublisherService;

  beforeEach(function () {
    packetEventBus = imock();
    packetConnection = imock();
    service = new PacketEventPublisherService(instance(packetEventBus));
  });

  describe('#publishPacketMessage()', function () {
    it('should emit packets through the packet event bus when has handlers for the packet', async function () {
      const packet = new Packet(givenSomePacketProps());
      const packetMessage = new PacketMessage(instance(packetConnection), packet);

      when(packetEventBus.listenerCount(anything())).thenReturn(1);

      await service.publishPacketMessage(packetMessage);

      verify(packetEventBus.listenerCount(packet.payload.opcode.name)).once();
      verify(packetEventBus.emit(packet.sequence.toString(), packetMessage)).once();
      verify(packetEventBus.emit(packet.payload.opcode.name, packetMessage)).once();
    });

    it('should throw an error when there is no handlers for the packet', async function () {
      const packet = new Packet(givenSomePacketProps());
      const packetMessage = new PacketMessage(instance(packetConnection), packet);

      when(packetEventBus.listenerCount(anything())).thenReturn(0);

      await expect(service.publishPacketMessage(packetMessage)).to.be.rejectedWith(
        DomainException,
        `No event handler found for packet event 'DEVICE_GETTIME_RSP'`,
      );

      verify(packetEventBus.listenerCount(packet.payload.opcode.name)).once();
      verify(packetEventBus.emit(anything(), anything())).never();
    });
  });
});
