import { imock, instance } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceLocatedEventHandler } from './device-located.event-handler';
import type { PacketMessage } from '../objects/packet.message';

describe('DeviceLocatedEventHandler', function () {
  let eventHandler: DeviceLocatedEventHandler;
  let packetMessage: PacketMessage<'DEVICE_SEEK_LOCATION_RSP'>;

  beforeEach(function () {
    eventHandler = new DeviceLocatedEventHandler();
    packetMessage = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DEVICE_SEEK_LOCATION_RSP');
  });

  describe('#handle()', function () {
    it('should do nothing', async function () {
      await eventHandler.handle(instance(packetMessage));
    });
  });
});
