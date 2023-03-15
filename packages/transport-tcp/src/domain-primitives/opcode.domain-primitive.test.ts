import { ArgumentInvalidException, DomainPrimitive } from '@agnoc/toolkit';
import { expect } from 'chai';
import { OPCode } from './opcode.domain-primitive';

describe('OPCode', function () {
  it('should be created', function () {
    const opcode = new OPCode('DEVICE_GETTIME_REQ');

    expect(opcode).to.be.instanceOf(DomainPrimitive);
    expect(opcode.value).to.be.equal('DEVICE_GETTIME_REQ');
    expect(opcode.name).to.be.equal('DEVICE_GETTIME_REQ');
    expect(opcode.code).to.be.equal(0x1011);
  });

  it("should throw an error when 'value' is not a valid opcode", function () {
    // @ts-expect-error - invalid value
    expect(() => new OPCode('foo')).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'value' of OPCode is invalid`,
    );
  });

  describe('#toString()', function () {
    it('should return the string representation of the opcode', function () {
      const opcode = new OPCode('DEVICE_GETTIME_REQ');

      expect(opcode.toString()).to.be.equal('DEVICE_GETTIME_REQ');
    });
  });

  describe('#toJSON()', function () {
    it('should return the JSON representation of the opcode', function () {
      const opcode = new OPCode('DEVICE_GETTIME_REQ');

      expect(opcode.toJSON()).to.be.equal('DEVICE_GETTIME_REQ');
    });
  });

  describe('#fromCode()', function () {
    it('should create an opcode from a string code', function () {
      const opcode = OPCode.fromCode('0x1011');

      expect(opcode).to.be.instanceOf(OPCode);
      expect(opcode.value).to.be.equal('DEVICE_GETTIME_REQ');
    });

    it('should create an opcode from a number code', function () {
      const opcode = OPCode.fromCode(0x1011);

      expect(opcode).to.be.instanceOf(OPCode);
      expect(opcode.value).to.be.equal('DEVICE_GETTIME_REQ');
    });

    it("should throw an error when 'code' is not a valid opcode", function () {
      expect(() => OPCode.fromCode(0xffff)).to.throw(
        ArgumentInvalidException,
        `Value '65535' for property 'code' of OPCode is invalid`,
      );
    });
  });

  describe('#fromName()', function () {
    it('should create an opcode from a name', function () {
      const opcode = OPCode.fromName('DEVICE_GETTIME_REQ');

      expect(opcode).to.be.instanceOf(OPCode);
      expect(opcode.value).to.be.equal('DEVICE_GETTIME_REQ');
    });
  });
});
