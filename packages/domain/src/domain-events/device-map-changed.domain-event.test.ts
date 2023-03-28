import { DomainEvent, ArgumentNotProvidedException, ArgumentInvalidException, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceMap } from '../entities/device-map.entity';
import { givenSomeDeviceMapProps } from '../test-support';
import { DeviceMapChangedDomainEvent } from './device-map-changed.domain-event';
import type { DeviceMapChangedDomainEventProps } from './device-map-changed.domain-event';

describe('DeviceMapChangedDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeDeviceMapChangedDomainEventProps();
    const event = new DeviceMapChangedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.previousMap).to.be.undefined;
    expect(event.currentMap).to.be.equal(props.currentMap);
  });

  it("should be created with 'previousMap'", function () {
    const props = {
      ...givenSomeDeviceMapChangedDomainEventProps(),
      previousMap: new DeviceMap(givenSomeDeviceMapProps()),
    };
    const event = new DeviceMapChangedDomainEvent(props);

    expect(event.previousMap).to.be.equal(props.previousMap);
  });

  it("should thrown an error when 'currentMap' is not provided", function () {
    expect(
      () =>
        new DeviceMapChangedDomainEvent({
          ...givenSomeDeviceMapChangedDomainEventProps(),
          // @ts-expect-error - missing property
          currentMap: undefined,
        }),
    ).to.throw(ArgumentNotProvidedException, `Property 'currentMap' for DeviceMapChangedDomainEvent not provided`);
  });

  it("should thrown an error when 'previousMap' is not an instance of DeviceMap", function () {
    expect(
      () =>
        new DeviceMapChangedDomainEvent({
          ...givenSomeDeviceMapChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          previousMap: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousMap' of DeviceMapChangedDomainEvent is not an instance of DeviceMap",
    );
  });

  it("should thrown an error when 'currentMap' is not an instance of DeviceMap", function () {
    expect(
      () =>
        new DeviceMapChangedDomainEvent({
          ...givenSomeDeviceMapChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          currentMap: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentMap' of DeviceMapChangedDomainEvent is not an instance of DeviceMap",
    );
  });
});

function givenSomeDeviceMapChangedDomainEventProps(): DeviceMapChangedDomainEventProps {
  return {
    aggregateId: ID.generate(),
    previousMap: undefined,
    currentMap: new DeviceMap(givenSomeDeviceMapProps()),
  };
}
