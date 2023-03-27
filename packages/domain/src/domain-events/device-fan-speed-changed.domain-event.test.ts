import { DomainEvent, ArgumentNotProvidedException, ArgumentInvalidException, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceFanSpeed, DeviceFanSpeedValue } from '../domain-primitives/device-fan-speed.domain-primitive';
import { DeviceFanSpeedChangedDomainEvent } from './device-fan-speed-changed.domain-event';
import type { DeviceFanSpeedChangedDomainEventProps } from './device-fan-speed-changed.domain-event';

describe('DeviceFanSpeedChangedDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeDeviceFanSpeedChangedDomainEventProps();
    const event = new DeviceFanSpeedChangedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.previousFanSpeed).to.be.undefined;
    expect(event.currentFanSpeed).to.be.equal(props.currentFanSpeed);
  });

  it("should be created with 'previousFanSpeed'", function () {
    const props = {
      ...givenSomeDeviceFanSpeedChangedDomainEventProps(),
      previousFanSpeed: new DeviceFanSpeed(DeviceFanSpeedValue.Low),
    };
    const event = new DeviceFanSpeedChangedDomainEvent(props);

    expect(event.previousFanSpeed).to.be.equal(props.previousFanSpeed);
  });

  it("should thrown an error when 'currentFanSpeed' is not provided", function () {
    expect(
      () =>
        new DeviceFanSpeedChangedDomainEvent({
          ...givenSomeDeviceFanSpeedChangedDomainEventProps(),
          // @ts-expect-error - missing property
          currentFanSpeed: undefined,
        }),
    ).to.throw(
      ArgumentNotProvidedException,
      `Property 'currentFanSpeed' for DeviceFanSpeedChangedDomainEvent not provided`,
    );
  });

  it("should thrown an error when 'previousFanSpeed' is not an instance of DeviceFanSpeed", function () {
    expect(
      () =>
        new DeviceFanSpeedChangedDomainEvent({
          ...givenSomeDeviceFanSpeedChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          previousFanSpeed: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousFanSpeed' of DeviceFanSpeedChangedDomainEvent is not an instance of DeviceFanSpeed",
    );
  });

  it("should thrown an error when 'currentFanSpeed' is not an instance of DeviceFanSpeed", function () {
    expect(
      () =>
        new DeviceFanSpeedChangedDomainEvent({
          ...givenSomeDeviceFanSpeedChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          currentFanSpeed: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentFanSpeed' of DeviceFanSpeedChangedDomainEvent is not an instance of DeviceFanSpeed",
    );
  });
});

function givenSomeDeviceFanSpeedChangedDomainEventProps(): DeviceFanSpeedChangedDomainEventProps {
  return {
    aggregateId: ID.generate(),
    previousFanSpeed: undefined,
    currentFanSpeed: new DeviceFanSpeed(DeviceFanSpeedValue.Low),
  };
}
