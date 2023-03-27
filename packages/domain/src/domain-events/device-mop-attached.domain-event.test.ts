import { DomainEvent, ArgumentNotProvidedException, ArgumentInvalidException, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceMopAttachedDomainEvent } from './device-mop-attached.domain-event';
import type { DeviceMopAttachedDomainEventProps } from './device-mop-attached.domain-event';

describe('DeviceMopAttachedDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeDeviceMopAttachedDomainEventProps();
    const event = new DeviceMopAttachedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.isAttached).to.be.true;
  });

  it("should thrown an error when 'isAttached' is not provided", function () {
    expect(
      () =>
        new DeviceMopAttachedDomainEvent({
          ...givenSomeDeviceMopAttachedDomainEventProps(),
          // @ts-expect-error - missing property
          isAttached: undefined,
        }),
    ).to.throw(ArgumentNotProvidedException, `Property 'isAttached' for DeviceMopAttachedDomainEvent not provided`);
  });

  it("should thrown an error when 'isAttached' is not a boolean", function () {
    expect(
      () =>
        new DeviceMopAttachedDomainEvent({
          ...givenSomeDeviceMopAttachedDomainEventProps(),
          // @ts-expect-error - invalid property
          isAttached: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'isAttached' of DeviceMopAttachedDomainEvent is not a boolean",
    );
  });
});

function givenSomeDeviceMopAttachedDomainEventProps(): DeviceMopAttachedDomainEventProps {
  return {
    aggregateId: ID.generate(),
    isAttached: true,
  };
}
