import { EventBus } from '@agnoc/toolkit';
import { expect } from 'chai';
import { PacketEventBus } from './packet.event-bus';

describe('PacketEventBus', function () {
  it('should be created', function () {
    const packetEventBus = new PacketEventBus();

    expect(packetEventBus).to.be.instanceOf(EventBus);
  });
});
