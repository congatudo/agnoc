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
    expect(payload.data).to.be.equal(payloadProps.data);
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
    expect(() => new Payload({ ...givenSomePayloadProps(), data: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'data' for Payload not provided`,
    );
  });

  it('should throw an error when "opcode" is not an instance of OPCode', function () {
    // @ts-expect-error - invalid property
    expect(() => new Payload({ ...givenSomePayloadProps(), opcode: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'opcode' of Payload is not an instance of OPCode`,
    );
  });

  it('should throw an error when "data" is not an object', function () {
    // @ts-expect-error - invalid property
    expect(() => new Payload({ ...givenSomePayloadProps(), data: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'data' of Payload is not an instance of Object`,
    );
  });

  describe('#toString()', function () {
    it('should return a string representation of the Payload', function () {
      const payload = new Payload<'DEVICE_MAPID_PUSH_MAP_INFO'>({
        opcode: OPCode.fromName('DEVICE_MAPID_PUSH_MAP_INFO'),
        data: {
          mask: 0,
          mapGrid: Buffer.from('example'),
          historyHeadInfo: {
            mapHeadId: 1,
            poseId: 1,
            pointList: new Array(20).fill(0).map((_, i) => ({ flag: i, x: i, y: i })),
            pointNumber: 0,
          },
        },
      });

      expect(payload.toString()).to.be.equal(
        '{"opcode":"DEVICE_MAPID_PUSH_MAP_INFO","data":{"mask":0,"mapGrid":"[Buffer]","historyHeadInfo":{"mapHeadId":1,"poseId":1,"pointList":[{"flag":0,"x":0,"y":0},{"flag":1,"x":1,"y":1},{"flag":2,"x":2,"y":2},{"flag":3,"x":3,"y":3},{"flag":4,"x":4,"y":4},{"flag":5,"x":5,"y":5},{"flag":6,"x":6,"y":6},{"flag":7,"x":7,"y":7},{"flag":8,"x":8,"y":8},{"flag":9,"x":9,"y":9},"[20 more items...]"],"pointNumber":0}}}',
      );
    });
  });

  describe('#toJSON()', function () {
    it('should return a JSON representation of the Payload', function () {
      const data = { mask: 0, mapGrid: Buffer.from('example') };
      const payload = new Payload<'DEVICE_MAPID_PUSH_MAP_INFO'>({
        opcode: OPCode.fromName('DEVICE_MAPID_PUSH_MAP_INFO'),
        data,
      });

      expect(payload.toJSON()).to.be.deep.equal({
        opcode: 'DEVICE_MAPID_PUSH_MAP_INFO',
        data,
      });
    });
  });
});
