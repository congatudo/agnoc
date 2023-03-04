import { ArgumentInvalidException, ArgumentNotProvidedException, ID, ValueObject } from '@agnoc/toolkit';
import { expect } from 'chai';
import { OPCode } from '../domain-primitives/opcode.domain-primitive';
import { PacketSequence } from '../domain-primitives/packet-sequence.domain-primitive';
import { givenSomePacketProps } from '../test-support';
import { Packet } from './packet.value-object';
import { Payload } from './payload.value-object';

describe('Packet', function () {
  it('should be created', function () {
    const packetProps = givenSomePacketProps();
    const packet = new Packet(packetProps);

    expect(packet).to.be.instanceOf(ValueObject);
    expect(packet.ctype).to.be.equal(packetProps.ctype);
    expect(packet.flow).to.be.equal(packetProps.flow);
    expect(packet.deviceId).to.be.equal(packetProps.deviceId);
    expect(packet.userId).to.be.equal(packetProps.userId);
    expect(packet.sequence).to.be.equal(packetProps.sequence);
    expect(packet.payload).to.be.equal(packetProps.payload);
  });

  it("should throw an error when 'ctype' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Packet({ ...givenSomePacketProps(), ctype: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'ctype' for Packet not provided`,
    );
  });

  it("should throw an error when 'flow' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Packet({ ...givenSomePacketProps(), flow: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'flow' for Packet not provided`,
    );
  });

  it("should throw an error when 'deviceId' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Packet({ ...givenSomePacketProps(), deviceId: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'deviceId' for Packet not provided`,
    );
  });

  it("should throw an error when 'userId' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Packet({ ...givenSomePacketProps(), userId: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'userId' for Packet not provided`,
    );
  });

  it("should throw an error when 'sequence' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Packet({ ...givenSomePacketProps(), sequence: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'sequence' for Packet not provided`,
    );
  });

  it("should throw an error when 'payload' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new Packet({ ...givenSomePacketProps(), payload: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'payload' for Packet not provided`,
    );
  });

  it("should throw an error when 'ctype' property is not a number", function () {
    // @ts-expect-error - invalid property
    expect(() => new Packet({ ...givenSomePacketProps(), ctype: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'ctype' of Packet is not a number`,
    );
  });

  it("should throw an error when 'flow' property is not a number", function () {
    // @ts-expect-error - invalid property
    expect(() => new Packet({ ...givenSomePacketProps(), flow: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'flow' of Packet is not a number`,
    );
  });

  it("should throw an error when 'userId' property is not an instance of ID", function () {
    // @ts-expect-error - invalid property
    expect(() => new Packet({ ...givenSomePacketProps(), userId: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'userId' of Packet is not an instance of ID`,
    );
  });

  it("should throw an error when 'deviceId' property is not an instance of ID", function () {
    // @ts-expect-error - invalid property
    expect(() => new Packet({ ...givenSomePacketProps(), deviceId: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of Packet is not an instance of ID`,
    );
  });

  it("should throw an error when 'sequence' property is not an instance of PacketSequence", function () {
    // @ts-expect-error - invalid property
    expect(() => new Packet({ ...givenSomePacketProps(), sequence: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'sequence' of Packet is not an instance of PacketSequence`,
    );
  });

  it("should throw an error when 'payload' property is not an instance of Payload", function () {
    // @ts-expect-error - invalid property
    expect(() => new Packet({ ...givenSomePacketProps(), payload: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'payload' of Packet is not an instance of Payload`,
    );
  });

  describe('#toString()', function () {
    it('should return a string representation of the packet', function () {
      const packet = new Packet({
        ctype: 2,
        flow: 1,
        deviceId: new ID(3),
        userId: new ID(4),
        sequence: new PacketSequence(5n),
        payload: new Payload({
          opcode: OPCode.fromName('DEVICE_GETTIME_RSP'),
          buffer: Buffer.alloc(0),
          object: { result: 0, body: { deviceTime: 1606129555, deviceTimezone: 3600 } },
        }),
      });

      expect(packet.toString()).to.be.equal(
        '[5] [ctype: 2] [flow: 1] [userId: 4] [deviceId: 3] {"opcode":"DEVICE_GETTIME_RSP","object":{"result":0,"body":{"deviceTime":1606129555,"deviceTimezone":3600}}}',
      );
    });
  });
});
