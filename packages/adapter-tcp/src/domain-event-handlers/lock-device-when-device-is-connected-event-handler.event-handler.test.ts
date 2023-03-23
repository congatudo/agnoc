import { DeviceConnectedDomainEvent } from '@agnoc/domain';
import { ID } from '@agnoc/toolkit';
import { anything, deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { LockDeviceWhenDeviceIsConnectedEventHandler } from './lock-device-when-device-is-connected-event-handler.event-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketConnectionFinderService } from '../packet-connection-finder.service';

describe('LockDeviceWhenDeviceIsConnectedEventHandler', function () {
  let packetConnectionFinderService: PacketConnectionFinderService;
  let eventHandler: LockDeviceWhenDeviceIsConnectedEventHandler;
  let packetConnection: PacketConnection;

  beforeEach(function () {
    packetConnectionFinderService = imock();
    eventHandler = new LockDeviceWhenDeviceIsConnectedEventHandler(instance(packetConnectionFinderService));
    packetConnection = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DeviceConnectedDomainEvent');
  });

  describe('#handle()', function () {
    it('should lock the device', async function () {
      const event = new DeviceConnectedDomainEvent({ aggregateId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));

      await eventHandler.handle(event);

      verify(packetConnection.send('DEVICE_CONTROL_LOCK_REQ', deepEqual({}))).once();
    });

    it('should do nothing when no connection is found', async function () {
      const event = new DeviceConnectedDomainEvent({ aggregateId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await eventHandler.handle(event);

      verify(packetConnection.send(anything(), anything())).never();
    });
  });
});
