import { imock, instance } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceMemoryMapInfoEventHandler } from './device-memory-map-info.event-handler';
import type { PacketMessage } from '../objects/packet.message';

describe('DeviceMemoryMapInfoEventHandler', function () {
  let eventHandler: DeviceMemoryMapInfoEventHandler;
  let packetMessage: PacketMessage<'DEVICE_MAPID_PUSH_ALL_MEMORY_MAP_INFO'>;

  beforeEach(function () {
    eventHandler = new DeviceMemoryMapInfoEventHandler();
    packetMessage = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DEVICE_MAPID_PUSH_ALL_MEMORY_MAP_INFO');
  });

  describe('#handle()', function () {
    it('should do nothing', async function () {
      await eventHandler.handle(instance(packetMessage));
    });
  });
});
