import { DomainEvent, ID, ArgumentInvalidException, ArgumentNotProvidedException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceBattery } from '../domain-primitives/device-battery.domain-primitive';
import { DeviceBatteryChangedDomainEvent } from './device-battery-changed.domain-event';
import type { DeviceBatteryChangedDomainEventProps } from './device-battery-changed.domain-event';

describe('DeviceBatteryChangedDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeDeviceBatteryChangedDomainEventProps();
    const event = new DeviceBatteryChangedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.previousBattery).to.be.equal(props.previousBattery);
    expect(event.currentBattery).to.be.equal(props.currentBattery);
  });

  it("should thrown an error when 'previousBattery' is not provided", function () {
    expect(
      () =>
        new DeviceBatteryChangedDomainEvent({
          ...givenSomeDeviceBatteryChangedDomainEventProps(),
          // @ts-expect-error - missing property
          previousBattery: undefined,
        }),
    ).to.throw(
      ArgumentNotProvidedException,
      `Property 'previousBattery' for DeviceBatteryChangedDomainEvent not provided`,
    );
  });

  it("should thrown an error when 'currentBattery' is not provided", function () {
    expect(
      () =>
        new DeviceBatteryChangedDomainEvent({
          ...givenSomeDeviceBatteryChangedDomainEventProps(),
          // @ts-expect-error - missing property
          currentBattery: undefined,
        }),
    ).to.throw(
      ArgumentNotProvidedException,
      `Property 'currentBattery' for DeviceBatteryChangedDomainEvent not provided`,
    );
  });

  it("should thrown an error when 'previousBattery' is not an instance of ID", function () {
    expect(
      () =>
        new DeviceBatteryChangedDomainEvent({
          ...givenSomeDeviceBatteryChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          previousBattery: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousBattery' of DeviceBatteryChangedDomainEvent is not an instance of DeviceBattery",
    );
  });

  it("should thrown an error when 'currentBattery' is not an instance of ID", function () {
    expect(
      () =>
        new DeviceBatteryChangedDomainEvent({
          ...givenSomeDeviceBatteryChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          currentBattery: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentBattery' of DeviceBatteryChangedDomainEvent is not an instance of DeviceBattery",
    );
  });
});

function givenSomeDeviceBatteryChangedDomainEventProps(): DeviceBatteryChangedDomainEventProps {
  return {
    aggregateId: ID.generate(),
    previousBattery: new DeviceBattery(50),
    currentBattery: new DeviceBattery(100),
  };
}
