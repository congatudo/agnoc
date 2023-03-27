import { DomainEvent, ArgumentNotProvidedException, ArgumentInvalidException, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceWaterLevel, DeviceWaterLevelValue } from '../domain-primitives/device-water-level.domain-primitive';
import { DeviceWaterLevelChangedDomainEvent } from './device-water-level-changed.domain-event';
import type { DeviceWaterLevelChangedDomainEventProps } from './device-water-level-changed.domain-event';

describe('DeviceWaterLevelChangedDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeDeviceWaterLevelChangedDomainEventProps();
    const event = new DeviceWaterLevelChangedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.previousWaterLevel).to.be.undefined;
    expect(event.currentWaterLevel).to.be.equal(props.currentWaterLevel);
  });

  it("should be created with 'previousWaterLevel'", function () {
    const props = {
      ...givenSomeDeviceWaterLevelChangedDomainEventProps(),
      previousWaterLevel: new DeviceWaterLevel(DeviceWaterLevelValue.Low),
    };
    const event = new DeviceWaterLevelChangedDomainEvent(props);

    expect(event.previousWaterLevel).to.be.equal(props.previousWaterLevel);
  });

  it("should thrown an error when 'currentWaterLevel' is not provided", function () {
    expect(
      () =>
        new DeviceWaterLevelChangedDomainEvent({
          ...givenSomeDeviceWaterLevelChangedDomainEventProps(),
          // @ts-expect-error - missing property
          currentWaterLevel: undefined,
        }),
    ).to.throw(
      ArgumentNotProvidedException,
      `Property 'currentWaterLevel' for DeviceWaterLevelChangedDomainEvent not provided`,
    );
  });

  it("should thrown an error when 'previousWaterLevel' is not an instance of DeviceWaterLevel", function () {
    expect(
      () =>
        new DeviceWaterLevelChangedDomainEvent({
          ...givenSomeDeviceWaterLevelChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          previousWaterLevel: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousWaterLevel' of DeviceWaterLevelChangedDomainEvent is not an instance of DeviceWaterLevel",
    );
  });

  it("should thrown an error when 'currentWaterLevel' is not an instance of DeviceWaterLevel", function () {
    expect(
      () =>
        new DeviceWaterLevelChangedDomainEvent({
          ...givenSomeDeviceWaterLevelChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          currentWaterLevel: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentWaterLevel' of DeviceWaterLevelChangedDomainEvent is not an instance of DeviceWaterLevel",
    );
  });
});

function givenSomeDeviceWaterLevelChangedDomainEventProps(): DeviceWaterLevelChangedDomainEventProps {
  return {
    aggregateId: ID.generate(),
    previousWaterLevel: undefined,
    currentWaterLevel: new DeviceWaterLevel(DeviceWaterLevelValue.Low),
  };
}
