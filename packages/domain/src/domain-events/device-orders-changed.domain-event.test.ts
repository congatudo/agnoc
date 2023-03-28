import { DomainEvent, ArgumentNotProvidedException, ArgumentInvalidException, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceOrder } from '../entities/device-order.entity';
import { givenSomeDeviceOrderProps } from '../test-support';
import { DeviceOrdersChangedDomainEvent } from './device-orders-changed.domain-event';
import type { DeviceOrdersChangedDomainEventProps } from './device-orders-changed.domain-event';

describe('DeviceOrdersChangedDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeDeviceOrdersChangedDomainEventProps();
    const event = new DeviceOrdersChangedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.previousOrders).to.be.undefined;
    expect(event.currentOrders).to.be.equal(props.currentOrders);
  });

  it("should be created with 'previousOrders'", function () {
    const props = {
      ...givenSomeDeviceOrdersChangedDomainEventProps(),
      previousOrders: [new DeviceOrder(givenSomeDeviceOrderProps())],
    };
    const event = new DeviceOrdersChangedDomainEvent(props);

    expect(event.previousOrders).to.be.equal(props.previousOrders);
  });

  it("should thrown an error when 'currentOrders' is not provided", function () {
    expect(
      () =>
        new DeviceOrdersChangedDomainEvent({
          ...givenSomeDeviceOrdersChangedDomainEventProps(),
          // @ts-expect-error - missing property
          currentOrders: undefined,
        }),
    ).to.throw(
      ArgumentNotProvidedException,
      `Property 'currentOrders' for DeviceOrdersChangedDomainEvent not provided`,
    );
  });

  it("should thrown an error when 'previousOrders' is not an array", function () {
    expect(
      () =>
        new DeviceOrdersChangedDomainEvent({
          ...givenSomeDeviceOrdersChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          previousOrders: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousOrders' of DeviceOrdersChangedDomainEvent is not an array",
    );
  });

  it("should thrown an error when 'previousOrders' is not an array of DeviceOrder", function () {
    expect(
      () =>
        new DeviceOrdersChangedDomainEvent({
          ...givenSomeDeviceOrdersChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          previousOrders: ['foo'],
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousOrders' of DeviceOrdersChangedDomainEvent is not an array of DeviceOrder",
    );
  });

  it("should thrown an error when 'currentOrders' is not an array", function () {
    expect(
      () =>
        new DeviceOrdersChangedDomainEvent({
          ...givenSomeDeviceOrdersChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          currentOrders: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentOrders' of DeviceOrdersChangedDomainEvent is not an array",
    );
  });

  it("should thrown an error when 'currentOrders' is not an array of DeviceOrder", function () {
    expect(
      () =>
        new DeviceOrdersChangedDomainEvent({
          ...givenSomeDeviceOrdersChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          currentOrders: ['foo'],
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentOrders' of DeviceOrdersChangedDomainEvent is not an array of DeviceOrder",
    );
  });
});

function givenSomeDeviceOrdersChangedDomainEventProps(): DeviceOrdersChangedDomainEventProps {
  return {
    aggregateId: ID.generate(),
    previousOrders: undefined,
    currentOrders: [new DeviceOrder(givenSomeDeviceOrderProps())],
  };
}
