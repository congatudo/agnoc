import { ArgumentInvalidException, ArgumentOutOfRangeException, DomainPrimitive } from '@agnoc/toolkit';
import { expect } from 'chai';
import { OPCODES } from '../constants/opcodes.constant';
import { OPCode } from './opcode.domain-primitive';

describe('OPCode', function () {
  it('should be created', function () {
    const opcode = new OPCode(OPCODES.DEVICE_GETTIME_REQ);

    expect(opcode).to.be.instanceOf(DomainPrimitive);
    expect(opcode.value).to.be.equal(OPCODES.DEVICE_GETTIME_REQ);
    expect(opcode.name).to.be.equal('DEVICE_GETTIME_REQ');
    expect(opcode.code).to.be.equal('0x1011');
  });

  it("should throw an error when 'value' is not a number", function () {
    // @ts-expect-error - invalid value
    expect(() => new OPCode('foo')).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'value' of OPCode is not a number`,
    );
  });

  it("should throw an error when 'value' is out of range", function () {
    // @ts-expect-error - invalid value
    expect(() => new OPCode(0x10000)).to.throw(
      ArgumentOutOfRangeException,
      `Value '65536' for property 'value' of OPCode is out of range [0, 65535]`,
    );
  });

  it("should throw an error when 'value' is not a valid opcode", function () {
    // @ts-expect-error - invalid value
    expect(() => new OPCode(0x0003)).to.throw(
      ArgumentInvalidException,
      `Value '3' for property 'value' of OPCode is invalid`,
    );
  });

  describe('#toString()', function () {
    it('should return the string representation of the opcode', function () {
      const opcode = new OPCode(OPCODES.DEVICE_GETTIME_REQ);

      expect(opcode.toString()).to.be.equal('DEVICE_GETTIME_REQ');
    });
  });

  describe('#toJSON()', function () {
    it('should return the JSON representation of the opcode', function () {
      const opcode = new OPCode(OPCODES.DEVICE_GETTIME_REQ);

      expect(opcode.toJSON()).to.be.equal('DEVICE_GETTIME_REQ');
    });
  });

  describe('#fromCode()', function () {
    it('should create an opcode from a code', function () {
      const opcode = OPCode.fromCode('0x1011');

      expect(opcode).to.be.instanceOf(OPCode);
      expect(opcode.value).to.be.equal(OPCODES.DEVICE_GETTIME_REQ);
    });
  });

  describe('#fromName()', function () {
    it('should create an opcode from a name', function () {
      const opcode = OPCode.fromName('DEVICE_GETTIME_REQ');

      expect(opcode).to.be.instanceOf(OPCode);
      expect(opcode.value).to.be.equal(OPCODES.DEVICE_GETTIME_REQ);
    });

    it("should throw an error when 'name' is not a valid opcode", function () {
      // @ts-expect-error - invalid value
      expect(() => OPCode.fromName('foo')).to.throw(
        ArgumentInvalidException,
        `Value 'foo' for property 'name' of OPCode is invalid`,
      );
    });
  });
});
