import { ArgumentInvalidException, ID } from '@agnoc/toolkit';
import { anything, imock, instance, when, capture } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { OPCode } from '../domain-primitives/opcode.domain-primitive';
import { PacketSequence } from '../domain-primitives/packet-sequence.domain-primitive';
import { givenSomePayloadProps } from '../test-support';
import { Packet } from '../value-objects/packet.value-object';
import { Payload } from '../value-objects/payload.value-object';
import { PacketMapper } from './packet.mapper';
import type { PayloadFactory } from '../factories/payload.factory';

describe('PacketMapper', function () {
  let payloadFactory: PayloadFactory;
  let packetMapper: PacketMapper;

  beforeEach(function () {
    payloadFactory = imock();
    packetMapper = new PacketMapper(instance(payloadFactory));
  });

  describe('#toDomain()', function () {
    it('should map a buffer to a packet with payload', function () {
      const buffer = Buffer.from('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c', 'hex');
      const payload = new Payload(givenSomePayloadProps());

      when(payloadFactory.create(anything(), anything())).thenReturn(payload);

      const packet = packetMapper.toDomain(buffer);

      expect(packet).to.be.instanceOf(Packet);
      expect(packet.ctype).to.equal(2);
      expect(packet.flow).to.equal(1);
      expect(packet.deviceId.value).to.equal(1);
      expect(packet.userId.value).to.equal(2);
      expect(packet.sequence.toString()).to.equal('7a479a0fbb978c12');
      expect(packet.payload).to.equal(payload);

      const [opcode, payloadBuffer] = capture(payloadFactory.create).first();

      expect(opcode.equals(OPCode.fromName('DEVICE_GETTIME_RSP'))).to.be.true;
      expect((payloadBuffer as Buffer).toString('hex')).to.equal('08001a090893afeefd0510901c');
    });

    it('should map a buffer to a packet without payload', function () {
      const buffer = Buffer.from('1800000002010100000002000000128c97bb0f9a477a1210', 'hex');
      const payload = new Payload(givenSomePayloadProps());

      when(payloadFactory.create(anything(), anything())).thenReturn(payload);

      const packet = packetMapper.toDomain(buffer);

      expect(packet).to.be.instanceOf(Packet);
      expect(packet.ctype).to.equal(2);
      expect(packet.flow).to.equal(1);
      expect(packet.deviceId.value).to.equal(1);
      expect(packet.userId.value).to.equal(2);
      expect(packet.sequence.toString()).to.equal('7a479a0fbb978c12');
      expect(packet.payload).to.equal(payload);

      const [opcode, payloadBuffer] = capture(payloadFactory.create).first();

      expect(opcode.equals(OPCode.fromName('DEVICE_GETTIME_RSP'))).to.be.true;
      expect((payloadBuffer as Buffer).toString('hex')).to.equal('');
    });

    it('should throw an error when the buffer is too short', function () {
      const buffer = Buffer.from('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901', 'hex');

      expect(() => packetMapper.toDomain(buffer)).to.throw(
        ArgumentInvalidException,
        'Buffer is too short to be a valid packet',
      );
    });
  });

  describe('#toBuffer()', function () {
    it('should map a packet to a buffer', function () {
      const packet = new Packet({
        ctype: 2,
        flow: 1,
        deviceId: new ID(1),
        userId: new ID(2),
        sequence: PacketSequence.fromString('7a479a0fbb978c12'),
        payload: new Payload({
          opcode: OPCode.fromName('DEVICE_GETTIME_RSP'),
          buffer: Buffer.from('08001a090893afeefd0510901c', 'hex'),
          object: { result: 1, body: { deviceTime: 1 } },
        }),
      });

      const buffer = packetMapper.fromDomain(packet);

      expect(buffer.toString('hex')).to.equal(
        '2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c',
      );
    });
  });
});
