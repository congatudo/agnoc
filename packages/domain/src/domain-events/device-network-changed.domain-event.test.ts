import { DomainEvent, ArgumentNotProvidedException, ArgumentInvalidException, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeDeviceNetworkProps } from '../test-support';
import { DeviceNetwork } from '../value-objects/device-network.value-object';
import { DeviceNetworkChangedDomainEvent } from './device-network-changed.domain-event';
import type { DeviceNetworkChangedDomainEventProps } from './device-network-changed.domain-event';

describe('DeviceNetworkChangedDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeDeviceNetworkChangedDomainEventProps();
    const event = new DeviceNetworkChangedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.previousNetwork).to.be.undefined;
    expect(event.currentNetwork).to.be.equal(props.currentNetwork);
  });

  it("should be created with 'previousNetwork'", function () {
    const props = {
      ...givenSomeDeviceNetworkChangedDomainEventProps(),
      previousNetwork: new DeviceNetwork(givenSomeDeviceNetworkProps()),
    };
    const event = new DeviceNetworkChangedDomainEvent(props);

    expect(event.previousNetwork).to.be.equal(props.previousNetwork);
  });

  it("should thrown an error when 'currentNetwork' is not provided", function () {
    expect(
      () =>
        new DeviceNetworkChangedDomainEvent({
          ...givenSomeDeviceNetworkChangedDomainEventProps(),
          // @ts-expect-error - missing property
          currentNetwork: undefined,
        }),
    ).to.throw(
      ArgumentNotProvidedException,
      `Property 'currentNetwork' for DeviceNetworkChangedDomainEvent not provided`,
    );
  });

  it("should thrown an error when 'previousNetwork' is not an instance of DeviceNetwork", function () {
    expect(
      () =>
        new DeviceNetworkChangedDomainEvent({
          ...givenSomeDeviceNetworkChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          previousNetwork: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousNetwork' of DeviceNetworkChangedDomainEvent is not an instance of DeviceNetwork",
    );
  });

  it("should thrown an error when 'currentNetwork' is not an instance of DeviceNetwork", function () {
    expect(
      () =>
        new DeviceNetworkChangedDomainEvent({
          ...givenSomeDeviceNetworkChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          currentNetwork: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentNetwork' of DeviceNetworkChangedDomainEvent is not an instance of DeviceNetwork",
    );
  });
});

function givenSomeDeviceNetworkChangedDomainEventProps(): DeviceNetworkChangedDomainEventProps {
  return {
    aggregateId: ID.generate(),
    previousNetwork: undefined,
    currentNetwork: new DeviceNetwork(givenSomeDeviceNetworkProps()),
  };
}
