import { ID, DomainEvent } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceLockedDomainEvent } from './device-locked.domain-event';

describe('DeviceLockedDomainEvent', function () {
  it('should be created', function () {
    const deviceLockedDomainEvent = new DeviceLockedDomainEvent({ aggregateId: ID.generate() });

    expect(deviceLockedDomainEvent).to.be.instanceOf(DomainEvent);
  });
});
