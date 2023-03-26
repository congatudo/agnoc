import { DomainEvent, ID, ArgumentInvalidException, ArgumentNotProvidedException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceVersion } from '../value-objects/device-version.value-object';
import { DeviceVersionChangedDomainEvent } from './device-version-changed.domain-event';
import type { DeviceVersionChangedDomainEventProps } from './device-version-changed.domain-event';

describe('DeviceVersionChangedDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeDeviceVersionChangedDomainEventProps();
    const event = new DeviceVersionChangedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.previousVersion).to.be.equal(props.previousVersion);
    expect(event.currentVersion).to.be.equal(props.currentVersion);
  });

  it("should thrown an error when 'previousVersion' is not provided", function () {
    expect(
      () =>
        new DeviceVersionChangedDomainEvent({
          ...givenSomeDeviceVersionChangedDomainEventProps(),
          // @ts-expect-error - missing property
          previousVersion: undefined,
        }),
    ).to.throw(
      ArgumentNotProvidedException,
      `Property 'previousVersion' for DeviceVersionChangedDomainEvent not provided`,
    );
  });

  it("should thrown an error when 'currentVersion' is not provided", function () {
    expect(
      () =>
        new DeviceVersionChangedDomainEvent({
          ...givenSomeDeviceVersionChangedDomainEventProps(),
          // @ts-expect-error - missing property
          currentVersion: undefined,
        }),
    ).to.throw(
      ArgumentNotProvidedException,
      `Property 'currentVersion' for DeviceVersionChangedDomainEvent not provided`,
    );
  });

  it("should thrown an error when 'previousVersion' is not an instance of ID", function () {
    expect(
      () =>
        new DeviceVersionChangedDomainEvent({
          ...givenSomeDeviceVersionChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          previousVersion: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousVersion' of DeviceVersionChangedDomainEvent is not an instance of DeviceVersion",
    );
  });

  it("should thrown an error when 'currentVersion' is not an instance of ID", function () {
    expect(
      () =>
        new DeviceVersionChangedDomainEvent({
          ...givenSomeDeviceVersionChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          currentVersion: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentVersion' of DeviceVersionChangedDomainEvent is not an instance of DeviceVersion",
    );
  });
});

function givenSomeDeviceVersionChangedDomainEventProps(): DeviceVersionChangedDomainEventProps {
  return {
    aggregateId: ID.generate(),
    previousVersion: new DeviceVersion({ software: '1.0.0', hardware: '1.0.0' }),
    currentVersion: new DeviceVersion({ software: '1.0.1', hardware: '1.0.1' }),
  };
}
