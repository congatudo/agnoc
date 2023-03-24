import { imock, instance } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceTimeUpdateEventHandler } from './device-time-update.event-handler';
import type { PacketMessage } from '../packet.message';

describe('DeviceTimeUpdateEventHandler', function () {
  let eventHandler: DeviceTimeUpdateEventHandler;
  let packetMessage: PacketMessage<'DEVICE_GETTIME_RSP'>;

  beforeEach(function () {
    eventHandler = new DeviceTimeUpdateEventHandler();
    packetMessage = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DEVICE_GETTIME_RSP');
  });

  describe('#handle()', function () {
    it('should do nothing', async function () {
      await eventHandler.handle(instance(packetMessage));
    });
  });
});
