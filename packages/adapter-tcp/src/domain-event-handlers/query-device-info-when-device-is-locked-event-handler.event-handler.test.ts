import { Device, DeviceLockedDomainEvent, DeviceSystem } from '@agnoc/domain';
import { givenSomeDeviceProps, givenSomeDeviceSystemProps } from '@agnoc/domain/test-support';
import { ID } from '@agnoc/toolkit';
import { imock, instance, when, anything, verify, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { QueryDeviceInfoWhenDeviceIsLockedEventHandler } from './query-device-info-when-device-is-locked-event-handler.event-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { ConnectionWithDevice } from '@agnoc/domain';

describe('QueryDeviceInfoWhenDeviceIsLockedEventHandler', function () {
  let packetConnectionFinderService: PacketConnectionFinderService;
  let eventHandler: QueryDeviceInfoWhenDeviceIsLockedEventHandler;
  let packetConnection: PacketConnection & ConnectionWithDevice;

  beforeEach(function () {
    packetConnectionFinderService = imock();
    eventHandler = new QueryDeviceInfoWhenDeviceIsLockedEventHandler(instance(packetConnectionFinderService));
    packetConnection = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DeviceLockedDomainEvent');
  });

  describe('#handle()', function () {
    it('should query device info for type C3490', async function () {
      const system = new DeviceSystem({ ...givenSomeDeviceSystemProps(), type: 9 });
      const device = new Device({ ...givenSomeDeviceProps(), system });
      const event = new DeviceLockedDomainEvent({ aggregateId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(device);

      await eventHandler.handle(event);

      verify(packetConnection.send('DEVICE_ORDERLIST_GETTING_REQ', deepEqual({}))).once();
      verify(packetConnection.send('DEVICE_STATUS_GETTING_REQ', deepEqual({}))).once();
      verify(packetConnection.send('DEVICE_GET_ALL_GLOBAL_MAP_INFO_REQ', deepEqual({ unk1: 0, unk2: '' }))).once();
      verify(packetConnection.send('DEVICE_GETTIME_REQ', deepEqual({}))).once();
      verify(packetConnection.send('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', deepEqual({ mask: 0x78ff }))).once();
      verify(packetConnection.send('DEVICE_WLAN_INFO_GETTING_REQ', deepEqual({}))).once();
    });

    it('should query device info for type C3090', async function () {
      const system = new DeviceSystem({ ...givenSomeDeviceSystemProps(), type: 3 });
      const device = new Device({ ...givenSomeDeviceProps(), system });
      const event = new DeviceLockedDomainEvent({ aggregateId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.device).thenReturn(device);

      await eventHandler.handle(event);

      verify(packetConnection.send('DEVICE_ORDERLIST_GETTING_REQ', deepEqual({}))).once();
      verify(packetConnection.send('DEVICE_STATUS_GETTING_REQ', deepEqual({}))).once();
      verify(packetConnection.send('DEVICE_GET_ALL_GLOBAL_MAP_INFO_REQ', deepEqual({ unk1: 0, unk2: '' }))).once();
      verify(packetConnection.send('DEVICE_GETTIME_REQ', deepEqual({}))).once();
      verify(packetConnection.send('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', deepEqual({ mask: 0xff }))).once();
      verify(packetConnection.send('DEVICE_WLAN_INFO_GETTING_REQ', deepEqual({}))).once();
    });

    it('should do nothing when no connection is found', async function () {
      const event = new DeviceLockedDomainEvent({ aggregateId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await eventHandler.handle(event);

      verify(packetConnection.send(anything(), anything())).never();
    });
  });
});
