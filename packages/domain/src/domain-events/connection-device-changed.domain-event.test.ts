import { ID, DomainEvent, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { ConnectionDeviceChangedDomainEvent } from './connection-device-changed.domain-event';

describe('ConnectionDeviceChangedDomainEvent', function () {
  it('should be created', function () {
    const props = { aggregateId: ID.generate() };
    const event = new ConnectionDeviceChangedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.previousDeviceId).to.be.undefined;
    expect(event.currentDeviceId).to.be.undefined;
  });

  it('should be created with previousDeviceId', function () {
    const props = { aggregateId: ID.generate(), previousDeviceId: ID.generate() };
    const event = new ConnectionDeviceChangedDomainEvent(props);

    expect(event.previousDeviceId).to.be.equal(props.previousDeviceId);
    expect(event.currentDeviceId).to.be.undefined;
  });

  it('should be created with currentDeviceId', function () {
    const props = { aggregateId: ID.generate(), currentDeviceId: ID.generate() };
    const event = new ConnectionDeviceChangedDomainEvent(props);

    expect(event.previousDeviceId).to.be.undefined;
    expect(event.currentDeviceId).to.be.equal(props.currentDeviceId);
  });

  it("should thrown an error when 'previousDeviceId' is not an instance of ID", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new ConnectionDeviceChangedDomainEvent({ aggregateId: ID.generate(), previousDeviceId: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousDeviceId' of ConnectionDeviceChangedDomainEvent is not an instance of ID",
    );
  });

  it("should thrown an error when 'currentDeviceId' is not an instance of ID", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new ConnectionDeviceChangedDomainEvent({ aggregateId: ID.generate(), currentDeviceId: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentDeviceId' of ConnectionDeviceChangedDomainEvent is not an instance of ID",
    );
  });
});
