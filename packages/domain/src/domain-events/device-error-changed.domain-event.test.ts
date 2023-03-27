import { DomainEvent, ArgumentNotProvidedException, ArgumentInvalidException, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceError, DeviceErrorValue } from '../domain-primitives/device-error.domain-primitive';
import { DeviceErrorChangedDomainEvent } from './device-error-changed.domain-event';
import type { DeviceErrorChangedDomainEventProps } from './device-error-changed.domain-event';

describe('DeviceErrorChangedDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeDeviceErrorChangedDomainEventProps();
    const event = new DeviceErrorChangedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.previousError).to.be.undefined;
    expect(event.currentError).to.be.equal(props.currentError);
  });

  it("should be created with 'previousError'", function () {
    const props = {
      ...givenSomeDeviceErrorChangedDomainEventProps(),
      previousError: new DeviceError(DeviceErrorValue.None),
    };
    const event = new DeviceErrorChangedDomainEvent(props);

    expect(event.previousError).to.be.equal(props.previousError);
  });

  it("should thrown an error when 'currentError' is not provided", function () {
    expect(
      () =>
        new DeviceErrorChangedDomainEvent({
          ...givenSomeDeviceErrorChangedDomainEventProps(),
          // @ts-expect-error - missing property
          currentError: undefined,
        }),
    ).to.throw(ArgumentNotProvidedException, `Property 'currentError' for DeviceErrorChangedDomainEvent not provided`);
  });

  it("should thrown an error when 'previousError' is not an instance of DeviceError", function () {
    expect(
      () =>
        new DeviceErrorChangedDomainEvent({
          ...givenSomeDeviceErrorChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          previousError: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousError' of DeviceErrorChangedDomainEvent is not an instance of DeviceError",
    );
  });

  it("should thrown an error when 'currentError' is not an instance of DeviceError", function () {
    expect(
      () =>
        new DeviceErrorChangedDomainEvent({
          ...givenSomeDeviceErrorChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          currentError: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentError' of DeviceErrorChangedDomainEvent is not an instance of DeviceError",
    );
  });
});

function givenSomeDeviceErrorChangedDomainEventProps(): DeviceErrorChangedDomainEventProps {
  return {
    aggregateId: ID.generate(),
    previousError: undefined,
    currentError: new DeviceError(DeviceErrorValue.None),
  };
}
