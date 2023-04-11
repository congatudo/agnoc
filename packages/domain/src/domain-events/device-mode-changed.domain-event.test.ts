import { DomainEvent, ArgumentNotProvidedException, ArgumentInvalidException, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceMode, DeviceModeValue } from '../domain-primitives/device-mode.domain-primitive';
import { DeviceModeChangedDomainEvent } from './device-mode-changed.domain-event';
import type { DeviceModeChangedDomainEventProps } from './device-mode-changed.domain-event';

describe('DeviceModeChangedDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeDeviceModeChangedDomainEventProps();
    const event = new DeviceModeChangedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.previousMode).to.be.undefined;
    expect(event.currentMode).to.be.equal(props.currentMode);
  });

  it("should be created with 'previousMode'", function () {
    const props = {
      ...givenSomeDeviceModeChangedDomainEventProps(),
      previousMode: new DeviceMode(DeviceModeValue.None),
    };
    const event = new DeviceModeChangedDomainEvent(props);

    expect(event.previousMode).to.be.equal(props.previousMode);
  });

  it("should thrown an error when 'currentMode' is not provided", function () {
    expect(
      () =>
        new DeviceModeChangedDomainEvent({
          ...givenSomeDeviceModeChangedDomainEventProps(),
          // @ts-expect-error - missing property
          currentMode: undefined,
        }),
    ).to.throw(ArgumentNotProvidedException, `Property 'currentMode' for DeviceModeChangedDomainEvent not provided`);
  });

  it("should thrown an error when 'previousMode' is not an instance of DeviceMode", function () {
    expect(
      () =>
        new DeviceModeChangedDomainEvent({
          ...givenSomeDeviceModeChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          previousMode: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousMode' of DeviceModeChangedDomainEvent is not an instance of DeviceMode",
    );
  });

  it("should thrown an error when 'currentMode' is not an instance of DeviceMode", function () {
    expect(
      () =>
        new DeviceModeChangedDomainEvent({
          ...givenSomeDeviceModeChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          currentMode: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentMode' of DeviceModeChangedDomainEvent is not an instance of DeviceMode",
    );
  });
});

function givenSomeDeviceModeChangedDomainEventProps(): DeviceModeChangedDomainEventProps {
  return {
    aggregateId: ID.generate(),
    previousMode: undefined,
    currentMode: new DeviceMode(DeviceModeValue.None),
  };
}
