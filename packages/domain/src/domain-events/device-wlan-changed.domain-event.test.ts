import { DomainEvent, ArgumentNotProvidedException, ArgumentInvalidException, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeDeviceWlanProps } from '../test-support';
import { DeviceWlan } from '../value-objects/device-wlan.value-object';
import { DeviceWlanChangedDomainEvent } from './device-wlan-changed.domain-event';
import type { DeviceWlanChangedDomainEventProps } from './device-wlan-changed.domain-event';

describe('DeviceWlanChangedDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeDeviceWlanChangedDomainEventProps();
    const event = new DeviceWlanChangedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.previousWlan).to.be.undefined;
    expect(event.currentWlan).to.be.equal(props.currentWlan);
  });

  it("should be created with 'previousWlan'", function () {
    const props = {
      ...givenSomeDeviceWlanChangedDomainEventProps(),
      previousWlan: new DeviceWlan(givenSomeDeviceWlanProps()),
    };
    const event = new DeviceWlanChangedDomainEvent(props);

    expect(event.previousWlan).to.be.equal(props.previousWlan);
  });

  it("should thrown an error when 'currentWlan' is not provided", function () {
    expect(
      () =>
        new DeviceWlanChangedDomainEvent({
          ...givenSomeDeviceWlanChangedDomainEventProps(),
          // @ts-expect-error - missing property
          currentWlan: undefined,
        }),
    ).to.throw(ArgumentNotProvidedException, `Property 'currentWlan' for DeviceWlanChangedDomainEvent not provided`);
  });

  it("should thrown an error when 'previousWlan' is not an instance of DeviceWlan", function () {
    expect(
      () =>
        new DeviceWlanChangedDomainEvent({
          ...givenSomeDeviceWlanChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          previousWlan: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousWlan' of DeviceWlanChangedDomainEvent is not an instance of DeviceWlan",
    );
  });

  it("should thrown an error when 'currentWlan' is not an instance of DeviceWlan", function () {
    expect(
      () =>
        new DeviceWlanChangedDomainEvent({
          ...givenSomeDeviceWlanChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          currentWlan: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentWlan' of DeviceWlanChangedDomainEvent is not an instance of DeviceWlan",
    );
  });
});

function givenSomeDeviceWlanChangedDomainEventProps(): DeviceWlanChangedDomainEventProps {
  return {
    aggregateId: ID.generate(),
    previousWlan: undefined,
    currentWlan: new DeviceWlan(givenSomeDeviceWlanProps()),
  };
}
