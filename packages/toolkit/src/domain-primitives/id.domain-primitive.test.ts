import { expect } from 'chai';
import { DomainPrimitive } from '../base-classes/domain-primitive.base';
import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception';
import { ID } from './id.domain-primitive';

describe('ID', function () {
  it('should be created', function () {
    const id = new ID(123);

    expect(id).to.be.instanceof(DomainPrimitive);
    expect(id.value).to.be.equal(123);
  });

  it('should throw an error when value is not a number', function () {
    // @ts-expect-error - invalid value
    expect(() => new ID('foo')).to.throw(ArgumentInvalidException, `Value 'foo' for id is not a positive integer`);
  });

  it('should throw an error when value is a float', function () {
    expect(() => new ID(0.5)).to.throw(ArgumentInvalidException, `Value '0.5' for id is not a positive integer`);
  });

  it('should throw an error when value is below zero', function () {
    expect(() => new ID(-5)).to.throw(ArgumentInvalidException, `Value '-5' for id is not a positive integer`);
  });

  describe('#generate()', function () {
    it('generates random id', function () {
      const id = ID.generate();

      expect(id).to.be.instanceof(ID);
    });
  });
});
