import { DomainEvent, ArgumentNotProvidedException, ArgumentInvalidException, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeDeviceSettingsProps } from '../test-support';
import { DeviceSettings } from '../value-objects/device-settings.value-object';
import { DeviceSettingsChangedDomainEvent } from './device-settings-changed.domain-event';
import type { DeviceSettingsChangedDomainEventProps } from './device-settings-changed.domain-event';

describe('DeviceSettingsChangedDomainEvent', function () {
  it('should be created', function () {
    const props = givenSomeDeviceSettingsChangedDomainEventProps();
    const event = new DeviceSettingsChangedDomainEvent(props);

    expect(event).to.be.instanceOf(DomainEvent);
    expect(event.aggregateId).to.be.equal(props.aggregateId);
    expect(event.previousSettings).to.be.undefined;
    expect(event.currentSettings).to.be.equal(props.currentSettings);
  });

  it("should be created with 'previousSettings'", function () {
    const props = {
      ...givenSomeDeviceSettingsChangedDomainEventProps(),
      previousSettings: new DeviceSettings(givenSomeDeviceSettingsProps()),
    };
    const event = new DeviceSettingsChangedDomainEvent(props);

    expect(event.previousSettings).to.be.equal(props.previousSettings);
  });

  it("should thrown an error when 'currentSettings' is not provided", function () {
    expect(
      () =>
        new DeviceSettingsChangedDomainEvent({
          ...givenSomeDeviceSettingsChangedDomainEventProps(),
          // @ts-expect-error - missing property
          currentSettings: undefined,
        }),
    ).to.throw(
      ArgumentNotProvidedException,
      `Property 'currentSettings' for DeviceSettingsChangedDomainEvent not provided`,
    );
  });

  it("should thrown an error when 'previousSettings' is not an instance of DeviceSettings", function () {
    expect(
      () =>
        new DeviceSettingsChangedDomainEvent({
          ...givenSomeDeviceSettingsChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          previousSettings: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'previousSettings' of DeviceSettingsChangedDomainEvent is not an instance of DeviceSettings",
    );
  });

  it("should thrown an error when 'currentSettings' is not an instance of DeviceSettings", function () {
    expect(
      () =>
        new DeviceSettingsChangedDomainEvent({
          ...givenSomeDeviceSettingsChangedDomainEventProps(),
          // @ts-expect-error - invalid property
          currentSettings: 'foo',
        }),
    ).to.throw(
      ArgumentInvalidException,
      "Value 'foo' for property 'currentSettings' of DeviceSettingsChangedDomainEvent is not an instance of DeviceSettings",
    );
  });
});

function givenSomeDeviceSettingsChangedDomainEventProps(): DeviceSettingsChangedDomainEventProps {
  return {
    aggregateId: ID.generate(),
    previousSettings: undefined,
    currentSettings: new DeviceSettings(givenSomeDeviceSettingsProps()),
  };
}
