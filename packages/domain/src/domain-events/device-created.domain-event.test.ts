import { ID, DomainEvent } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceCreatedDomainEvent } from './device-created.domain-event';

describe('DeviceCreatedDomainEvent', function () {
  it('should be created', function () {
    const deviceCreatedDomainEvent = new DeviceCreatedDomainEvent({ aggregateId: ID.generate() });

    expect(deviceCreatedDomainEvent).to.be.instanceOf(DomainEvent);
  });
});
