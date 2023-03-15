import { ArgumentInvalidException, ArgumentNotProvidedException, ValueObject } from '@agnoc/toolkit';
import { expect } from 'chai';
import { OPCode } from '../domain-primitives/opcode.domain-primitive';
import { givenSomePayloadProps } from '../test-support';
import { Payload } from './payload.value-object';

describe('Payload', function () {
  it('should be created', function () {
    const payloadProps = givenSomePayloadProps();
    const payload = new Payload(payloadProps);

    expect(payload).to.be.instanceOf(ValueObject);
    expect(payload.opcode).to.be.equal(payloadProps.opcode);
    expect(payload.object).to.be.equal(payloadProps.object);
  });

  it("should throw an error when 'opcode' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Payload({ ...givenSomePayloadProps(), opcode: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'opcode' for Payload not provided`,
    );
  });

  it("should throw an error when 'object' is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Payload({ ...givenSomePayloadProps(), object: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'object' for Payload not provided`,
    );
  });

  it('should throw an error when "opcode" is not an instance of OPCode', function () {
    // @ts-expect-error - invalid property
    expect(() => new Payload({ ...givenSomePayloadProps(), opcode: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'opcode' of Payload is not an instance of OPCode`,
    );
  });

  it('should throw an error when "object" is not an object', function () {
    // @ts-expect-error - invalid property
    expect(() => new Payload({ ...givenSomePayloadProps(), object: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'object' of Payload is not an instance of Object`,
    );
  });

  describe('#toString()', function () {
    it('should return a string representation of the Payload', function () {
      const payload = new Payload<'DEVICE_MAPID_PUSH_MAP_INFO'>({
        opcode: OPCode.fromName('DEVICE_MAPID_PUSH_MAP_INFO'),
        object: { mask: 0, mapGrid: Buffer.from('example') },
      });

      expect(payload.toString()).to.be.equal(
        '{"opcode":"DEVICE_MAPID_PUSH_MAP_INFO","object":{"mask":0,"mapGrid":"[Buffer]"}}',
      );
    });
  });

  describe('#toJSON()', function () {
    it('should return a JSON representation of the Payload', function () {
      const object = { mask: 0, mapGrid: Buffer.from('example') };
      const payload = new Payload<'DEVICE_MAPID_PUSH_MAP_INFO'>({
        opcode: OPCode.fromName('DEVICE_MAPID_PUSH_MAP_INFO'),
        object,
      });

      expect(payload.toJSON()).to.be.deep.equal({
        opcode: 'DEVICE_MAPID_PUSH_MAP_INFO',
        object,
      });
    });
  });
});
