import { ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';
import { expect } from 'chai';
import { CleanSize } from './clean-size.domain-primitive';

describe('CleanSize', function () {
  it('should be created', function () {
    const cleanSize = new CleanSize(10);

    expect(cleanSize).to.be.instanceOf(DomainPrimitive);
    expect(cleanSize.value).to.be.equal(10);
  });

  it('should throw an error when value is not a number', function () {
    // @ts-expect-error - invalid value
    expect(() => new CleanSize('foo')).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'value' of CleanSize is not a positive integer`,
    );
  });

  it('should throw an error when value is not an integer', function () {
    expect(() => new CleanSize(10.5)).to.throw(
      ArgumentInvalidException,
      `Value '10.5' for property 'value' of CleanSize is not a positive integer`,
    );
  });

  it('should throw an error when value is negative', function () {
    expect(() => new CleanSize(-10)).to.throw(
      ArgumentInvalidException,
      `Value '-10' for property 'value' of CleanSize is not a positive integer`,
    );
  });
});
