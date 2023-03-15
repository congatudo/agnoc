import { ArgumentInvalidException } from '@agnoc/toolkit';
import { anything, fnmock, imock, instance, when, verify } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { OPCode } from '../domain-primitives/opcode.domain-primitive';
import { Payload } from '../value-objects/payload.value-object';
import { PayloadMapper } from './payload.mapper';
import type { Decoder, Encoder, PayloadObjectParserService } from '../services/payload-object-parser.service';

describe('PayloadMapper', function () {
  let decoder: Decoder;
  let encoder: Encoder;
  let payloadObjectParserService: PayloadObjectParserService;
  let payloadMapper: PayloadMapper;

  beforeEach(function () {
    decoder = fnmock();
    encoder = fnmock();
    payloadObjectParserService = imock();
    payloadMapper = new PayloadMapper(instance(payloadObjectParserService));
  });

  describe('#toDomain()', function () {
    it('should create a payload from a buffer and opcode', function () {
      const buffer = Buffer.from('test');
      const opcode = OPCode.fromName('CLIENT_HEARTBEAT_REQ');
      const object = { foo: 'bar' };

      when(payloadObjectParserService.getDecoder(anything())).thenReturn(instance(decoder));
      when(decoder(anything())).thenReturn(object);

      const payload = payloadMapper.toDomain(buffer, opcode);

      expect(payload).to.be.instanceOf(Payload);
      expect(payload.opcode).to.equal(opcode);
      expect(payload.object).to.equal(object);

      verify(decoder(buffer)).once();
    });

    it('should throw an error when the decoder does not exist', function () {
      const buffer = Buffer.from('test');
      const opcode = OPCode.fromName('CLIENT_HEARTBEAT_REQ');

      when(payloadObjectParserService.getDecoder(anything())).thenReturn(undefined);

      expect(() => payloadMapper.toDomain(buffer, opcode)).to.throw(
        ArgumentInvalidException,
        `Decoder not found for opcode 'CLIENT_HEARTBEAT_REQ' while creating payload from buffer: 74657374`,
      );
    });
  });

  describe('#fromDomain()', function () {
    it('should create a buffer from a payload', function () {
      const opcode = OPCode.fromName('CLIENT_HEARTBEAT_REQ');
      const object = { foo: 'bar' };
      const payload = new Payload({ opcode: opcode, object: object });
      const buffer = Buffer.from('test');

      when(payloadObjectParserService.getEncoder(anything())).thenReturn(instance(encoder));
      when(encoder(anything())).thenReturn(buffer);

      const ret = payloadMapper.fromDomain(payload);

      expect(ret).to.equal(buffer);

      verify(encoder(object)).once();
    });

    it('should throw an error when the encoder does not exist', function () {
      const opcode = OPCode.fromName('CLIENT_HEARTBEAT_REQ');
      const object = { foo: 'bar' };
      const payload = new Payload({ opcode: opcode, object: object });

      when(payloadObjectParserService.getEncoder(anything())).thenReturn(undefined);

      expect(() => payloadMapper.fromDomain(payload)).to.throw(
        ArgumentInvalidException,
        `Encoder not found for opcode 'CLIENT_HEARTBEAT_REQ' while creating payload from object: {"foo":"bar"}`,
      );
    });
  });
});