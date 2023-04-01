import { DomainEvent, ArgumentNotProvidedException, ArgumentInvalidException, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeDeviceConsumableProps } from '../test-support';
import { DeviceConsumable } from '../value-objects/device-consumable.value-object';
import { DeviceConsumablesChangedDomainEvent } from './device-consumables-changed.domain-event';
import type { DeviceConsumablesChangedDomainEventProps } from './device-consumables-changed.domain-event';

describe('DeviceConsumablesChangedDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeDeviceConsumablesChangedDomainEventProps();
    const event = new DeviceConsumablesChangedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.previousConsumables).to.be.undefined;
    expect(event.currentConsumables).to.be.equal(props.currentConsumables);
  });

  it("should be created with 'previousConsumables'", function () {
    const props = {
      ...givenSomeDeviceConsumablesChangedDomainEventProps(),
      previousConsumables: [new DeviceConsumable(givenSomeDeviceConsumableProps())],
    };
    const event = new DeviceConsumablesChangedDomainEvent(props);

    expect(event.previousConsumables).to.be.equal(props.previousConsumables);
  });

  it("should thrown an error when 'currentConsumables' is not provided", function () {
    expect(
      () =>
        new DeviceConsumablesChangedDomainEvent({
          ...givenSomeDeviceConsumablesChangedDomainEventProps(),
          // @ts-expect-error - missing property
          currentConsumables: undefined,
        }),
    ).to.throw(
      ArgumentNotProvidedException,
      `Property 'currentConsumables' for DeviceConsumablesChangedDomainEvent not provided`,
    );
  });

  it("should thrown an error when 'previousConsumables' is not an array", function () {
    expect(
      () =>
        new DeviceConsumablesChangedDomainEvent({
          ...givenSomeDeviceConsumablesChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          previousConsumables: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousConsumables' of DeviceConsumablesChangedDomainEvent is not an array",
    );
  });

  it("should thrown an error when 'previousConsumables' is not an array of DeviceConsumable", function () {
    expect(
      () =>
        new DeviceConsumablesChangedDomainEvent({
          ...givenSomeDeviceConsumablesChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          previousConsumables: ['foo'],
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousConsumables' of DeviceConsumablesChangedDomainEvent is not an array of DeviceConsumable",
    );
  });

  it("should thrown an error when 'currentConsumables' is not an array", function () {
    expect(
      () =>
        new DeviceConsumablesChangedDomainEvent({
          ...givenSomeDeviceConsumablesChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          currentConsumables: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentConsumables' of DeviceConsumablesChangedDomainEvent is not an array",
    );
  });

  it("should thrown an error when 'currentConsumables' is not an array of DeviceConsumable", function () {
    expect(
      () =>
        new DeviceConsumablesChangedDomainEvent({
          ...givenSomeDeviceConsumablesChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          currentConsumables: ['foo'],
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentConsumables' of DeviceConsumablesChangedDomainEvent is not an array of DeviceConsumable",
    );
  });
});

function givenSomeDeviceConsumablesChangedDomainEventProps(): DeviceConsumablesChangedDomainEventProps {
  return {
    aggregateId: ID.generate(),
    previousConsumables: undefined,
    currentConsumables: [new DeviceConsumable(givenSomeDeviceConsumableProps())],
  };
}
