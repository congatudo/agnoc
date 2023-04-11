import { ID, DomainEvent } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceConnectedDomainEvent } from './device-connected.domain-event';

describe('DeviceConnectedDomainEvent', function () {
  it('should be created', function () {
    const deviceConnectedDomainEvent = new DeviceConnectedDomainEvent({ aggregateId: ID.generate() });

    expect(deviceConnectedDomainEvent).to.be.instanceOf(DomainEvent);
  });
});
