import { ValueObject, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { CleanSize } from './clean-size.value-object';

describe('CleanSize', function () {
  it('should be created', function () {
    const cleanSize = new CleanSize({ value: 10 });

    expect(cleanSize).to.be.instanceOf(ValueObject);
    expect(cleanSize.value).to.be.equal(10);
  });

  it('should throw an error when value is not an integer', function () {
    expect(() => new CleanSize({ value: 10.5 })).to.throw(
      ArgumentInvalidException,
      `Value '10.5' for clean size is not a positive integer`,
    );
  });

  it('should throw an error when value is negative', function () {
    expect(() => new CleanSize({ value: -10 })).to.throw(
      ArgumentInvalidException,
      `Value '-10' for clean size is not a positive integer`,
    );
  });
});
