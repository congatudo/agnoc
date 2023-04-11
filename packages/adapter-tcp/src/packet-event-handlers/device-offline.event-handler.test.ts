import { imock, instance } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceOfflineEventHandler } from './device-offline.event-handler';
import type { PacketMessage } from '../objects/packet.message';

describe('DeviceOfflineEventHandler', function () {
  let eventHandler: DeviceOfflineEventHandler;
  let packetMessage: PacketMessage<'DEVICE_OFFLINE_CMD'>;

  beforeEach(function () {
    eventHandler = new DeviceOfflineEventHandler();
    packetMessage = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DEVICE_OFFLINE_CMD');
  });

  describe('#handle()', function () {
    it('should do nothing', async function () {
      await eventHandler.handle(instance(packetMessage));
    });
  });
});
