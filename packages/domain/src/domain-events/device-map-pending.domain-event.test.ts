import { DomainEvent, ArgumentNotProvidedException, ArgumentInvalidException, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceMapPendingDomainEvent } from './device-map-pending.domain-event';
import type { DeviceMapPendingDomainEventProps } from './device-map-pending.domain-event';

describe('DeviceMapPendingDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeDeviceMapPendingDomainEventProps();
    const event = new DeviceMapPendingDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.isPending).to.be.true;
  });

  it("should thrown an error when 'isPending' is not provided", function () {
    expect(
      () =>
        new DeviceMapPendingDomainEvent({
          ...givenSomeDeviceMapPendingDomainEventProps(),
          // @ts-expect-error - missing property
          isPending: undefined,
        }),
    ).to.throw(ArgumentNotProvidedException, `Property 'isPending' for DeviceMapPendingDomainEvent not provided`);
  });

  it("should thrown an error when 'isPending' is not a boolean", function () {
    expect(
      () =>
        new DeviceMapPendingDomainEvent({
          ...givenSomeDeviceMapPendingDomainEventProps(),
          // @ts-expect-error - invalid property
          isPending: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'isPending' of DeviceMapPendingDomainEvent is not a boolean",
    );
  });
});

function givenSomeDeviceMapPendingDomainEventProps(): DeviceMapPendingDomainEventProps {
  return {
    aggregateId: ID.generate(),
    isPending: true,
  };
}
