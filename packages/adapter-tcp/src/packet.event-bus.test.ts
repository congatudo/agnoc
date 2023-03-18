import { expect } from 'chai';
import { TypedEmitter } from 'tiny-typed-emitter';
import { PacketEventBus } from './packet.event-bus';

describe('PacketEventBus', function () {
  it('should be created', function () {
    const packetEventBus = new PacketEventBus();

    expect(packetEventBus).to.be.instanceOf(TypedEmitter);
  });
});
