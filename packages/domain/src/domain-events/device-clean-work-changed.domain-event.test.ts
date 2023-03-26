import { DomainEvent, ArgumentNotProvidedException, ArgumentInvalidException, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeDeviceCleanWorkProps } from '../test-support';
import { DeviceCleanWork } from '../value-objects/device-clean-work.value-object';
import { DeviceCleanWorkChangedDomainEvent } from './device-clean-work-changed.domain-event';
import type { DeviceCleanWorkChangedDomainEventProps } from './device-clean-work-changed.domain-event';

describe('DeviceCleanWorkChangedDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeDeviceCleanWorkChangedDomainEventProps();
    const event = new DeviceCleanWorkChangedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.previousCleanWork).to.be.undefined;
    expect(event.currentCleanWork).to.be.equal(props.currentCleanWork);
  });

  it("should be created with 'previousCleanWork'", function () {
    const props = {
      ...givenSomeDeviceCleanWorkChangedDomainEventProps(),
      previousCleanWork: new DeviceCleanWork(givenSomeDeviceCleanWorkProps()),
    };
    const event = new DeviceCleanWorkChangedDomainEvent(props);

    expect(event.previousCleanWork).to.be.equal(props.previousCleanWork);
  });

  it("should thrown an error when 'currentCleanWork' is not provided", function () {
    expect(
      () =>
        new DeviceCleanWorkChangedDomainEvent({
          ...givenSomeDeviceCleanWorkChangedDomainEventProps(),
          // @ts-expect-error - missing property
          currentCleanWork: undefined,
        }),
    ).to.throw(
      ArgumentNotProvidedException,
      `Property 'currentCleanWork' for DeviceCleanWorkChangedDomainEvent not provided`,
    );
  });

  it("should thrown an error when 'previousCleanWork' is not an instance of DeviceCleanWork", function () {
    expect(
      () =>
        new DeviceCleanWorkChangedDomainEvent({
          ...givenSomeDeviceCleanWorkChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          previousCleanWork: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousCleanWork' of DeviceCleanWorkChangedDomainEvent is not an instance of DeviceCleanWork",
    );
  });

  it("should thrown an error when 'currentCleanWork' is not an instance of DeviceCleanWork", function () {
    expect(
      () =>
        new DeviceCleanWorkChangedDomainEvent({
          ...givenSomeDeviceCleanWorkChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          currentCleanWork: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentCleanWork' of DeviceCleanWorkChangedDomainEvent is not an instance of DeviceCleanWork",
    );
  });
});

function givenSomeDeviceCleanWorkChangedDomainEventProps(): DeviceCleanWorkChangedDomainEventProps {
  return {
    aggregateId: ID.generate(),
    previousCleanWork: undefined,
    currentCleanWork: new DeviceCleanWork(givenSomeDeviceCleanWorkProps()),
  };
}
