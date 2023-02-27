import { ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceState, DeviceStateValue } from './device-state.value-object';

describe('DeviceState', function () {
  it('should be created', function () {
    const deviceState = new DeviceState(DeviceStateValue.Idle);

    expect(deviceState).to.be.instanceOf(DomainPrimitive);
    expect(deviceState.value).to.be.equal(DeviceStateValue.Idle);
  });

  it('should throw an error when value is invalid', function () {
    // @ts-expect-error - invalid value
    expect(() => new DeviceState({ value: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for device state is invalid`,
    );
  });
});
