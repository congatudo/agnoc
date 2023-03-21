import { ID, DomainEvent } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeConnectionDeviceChangedDomainEventProps } from '../test-support';
import { ConnectionDeviceChangedDomainEvent } from './connection-device-changed.domain-event';

describe('ConnectionDeviceChangedDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeConnectionDeviceChangedDomainEventProps();
    const event = new ConnectionDeviceChangedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.previousDeviceId).to.be.undefined;
    expect(event.currentDeviceId).to.be.undefined;
  });

  it('should be created with previousDeviceId', function () {
    const props = { ...givenSomeConnectionDeviceChangedDomainEventProps(), previousDeviceId: ID.generate() };
    const event = new ConnectionDeviceChangedDomainEvent(props);

    expect(event.previousDeviceId).to.be.equal(event.previousDeviceId);
    expect(event.currentDeviceId).to.be.undefined;
  });

  it('should be created with currentDeviceId', function () {
    const event = new ConnectionDeviceChangedDomainEvent({ aggregateId: ID.generate() });

    expect(event.previousDeviceId).to.be.undefined;
    expect(event.previousDeviceId).to.be.equal(event.previousDeviceId);
  });
});
