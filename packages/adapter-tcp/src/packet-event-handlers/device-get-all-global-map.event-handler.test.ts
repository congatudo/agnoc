import { imock, instance } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceGetAllGlobalMapEventHandler } from './device-get-all-global-map.event-handler';
import type { PacketMessage } from '../objects/packet.message';

describe('DeviceGetAllGlobalMapEventHandler', function () {
  let eventHandler: DeviceGetAllGlobalMapEventHandler;
  let packetMessage: PacketMessage<'DEVICE_GET_ALL_GLOBAL_MAP_INFO_RSP'>;

  beforeEach(function () {
    eventHandler = new DeviceGetAllGlobalMapEventHandler();
    packetMessage = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DEVICE_GET_ALL_GLOBAL_MAP_INFO_RSP');
  });

  describe('#handle()', function () {
    it('should do nothing', async function () {
      await eventHandler.handle(instance(packetMessage));
    });
  });
});
