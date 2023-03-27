import { DomainEvent, ArgumentNotProvidedException, ArgumentInvalidException, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceState, DeviceStateValue } from '../domain-primitives/device-state.domain-primitive';
import { DeviceStateChangedDomainEvent } from './device-state-changed.domain-event';
import type { DeviceStateChangedDomainEventProps } from './device-state-changed.domain-event';

describe('DeviceStateChangedDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeDeviceStateChangedDomainEventProps();
    const event = new DeviceStateChangedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.previousState).to.be.undefined;
    expect(event.currentState).to.be.equal(props.currentState);
  });

  it("should be created with 'previousState'", function () {
    const props = {
      ...givenSomeDeviceStateChangedDomainEventProps(),
      previousState: new DeviceState(DeviceStateValue.Idle),
    };
    const event = new DeviceStateChangedDomainEvent(props);

    expect(event.previousState).to.be.equal(props.previousState);
  });

  it("should thrown an error when 'currentState' is not provided", function () {
    expect(
      () =>
        new DeviceStateChangedDomainEvent({
          ...givenSomeDeviceStateChangedDomainEventProps(),
          // @ts-expect-error - missing property
          currentState: undefined,
        }),
    ).to.throw(ArgumentNotProvidedException, `Property 'currentState' for DeviceStateChangedDomainEvent not provided`);
  });

  it("should thrown an error when 'previousState' is not an instance of DeviceState", function () {
    expect(
      () =>
        new DeviceStateChangedDomainEvent({
          ...givenSomeDeviceStateChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          previousState: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousState' of DeviceStateChangedDomainEvent is not an instance of DeviceState",
    );
  });

  it("should thrown an error when 'currentState' is not an instance of DeviceState", function () {
    expect(
      () =>
        new DeviceStateChangedDomainEvent({
          ...givenSomeDeviceStateChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          currentState: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentState' of DeviceStateChangedDomainEvent is not an instance of DeviceState",
    );
  });
});

function givenSomeDeviceStateChangedDomainEventProps(): DeviceStateChangedDomainEventProps {
  return {
    aggregateId: ID.generate(),
    previousState: undefined,
    currentState: new DeviceState(DeviceStateValue.Idle),
  };
}
