import { anything, imock, instance, spy, verify, capture } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { PacketEventHandler } from './packet.event-handler';
import type { PacketEventBus } from './packet.event-bus';
import type { PacketEventHandleParameter } from './packet.event-handler';

describe('PacketEventHandler', function () {
  let packetEventBus: PacketEventBus;
  let dummyPacketEventHandler: DummyPacketEventHandler;
  let dummyPacketEventHandlerSpy: DummyPacketEventHandler;

  beforeEach(function () {
    packetEventBus = imock();
    dummyPacketEventHandler = new DummyPacketEventHandler(instance(packetEventBus));
    dummyPacketEventHandlerSpy = spy(dummyPacketEventHandler);
  });

  it('should listen for events on the bus', function () {
    dummyPacketEventHandler.listen();

    verify(packetEventBus.on('DEVICE_GETTIME_RSP', anything())).once();
  });

  it('should call handle when event is emitted', function () {
    const eventParameter: PacketEventHandleParameter<DummyPacketEventHandler> = instance(imock());

    dummyPacketEventHandler.listen();

    const [eventName, callback] = capture(packetEventBus.on<'DEVICE_GETTIME_RSP'>).first();

    expect(eventName).to.equal('DEVICE_GETTIME_RSP');

    callback(eventParameter);

    verify(dummyPacketEventHandlerSpy.handle(eventParameter)).once();
  });
});

class DummyPacketEventHandler extends PacketEventHandler {
  eventName = 'DEVICE_GETTIME_RSP' as const;
  handle(_: PacketEventHandleParameter<DummyPacketEventHandler>) {
    // noop
  }
}
