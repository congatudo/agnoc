import { ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';
import { expect } from 'chai';
import { CleanMode, CleanModeValue } from './clean-mode.domain-primitive';

describe('CleanMode', function () {
  it('should be created', function () {
    const deviceWaterLevel = new CleanMode(CleanModeValue.Auto);

    expect(deviceWaterLevel).to.be.instanceOf(DomainPrimitive);
    expect(deviceWaterLevel.value).to.be.equal(CleanModeValue.Auto);
  });

  it('should throw an error when value is invalid', function () {
    // @ts-expect-error - invalid value
    expect(() => new CleanMode('foo')).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'value' of CleanMode is not one of 'Auto, Border, Mop'`,
    );
  });
});
