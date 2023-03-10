import { ArgumentInvalidException } from '@agnoc/toolkit';
import { anything, fnmock, imock, instance, when, verify } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { OPCode } from '../domain-primitives/opcode.domain-primitive';
import { Payload } from '../value-objects/payload.value-object';
import { PayloadFactory } from './payload.factory';
import type { Decoder, Encoder, PayloadObjectParserService } from '../services/payload-object-parser.service';

describe('PayloadFactory', function () {
  let decoder: Decoder;
  let encoder: Encoder;
  let payloadObjectParserService: PayloadObjectParserService;
  let payloadFactory: PayloadFactory;

  beforeEach(function () {
    decoder = fnmock();
    encoder = fnmock();
    payloadObjectParserService = imock();
    payloadFactory = new PayloadFactory(instance(payloadObjectParserService));
  });

  describe('#create()', function () {
    it('should create a payload from a buffer', function () {
      const buffer = Buffer.from('test');
      const opcode = OPCode.fromName('CLIENT_HEARTBEAT_REQ');
      const object = { foo: 'bar' };

      when(payloadObjectParserService.getDecoder(anything())).thenReturn(instance(decoder));
      when(decoder(anything())).thenReturn(object);

      const payload = payloadFactory.create(opcode, buffer);

      expect(payload).to.be.instanceOf(Payload);
      expect(payload.opcode).to.equal(opcode);
      expect(payload.object).to.equal(object);
      expect(payload.buffer).to.equal(buffer);

      verify(decoder(buffer)).once();
    });

    it('should throw an error when the decoder does not exist', function () {
      const buffer = Buffer.from('test');
      const opcode = OPCode.fromName('CLIENT_HEARTBEAT_REQ');

      when(payloadObjectParserService.getDecoder(anything())).thenReturn(undefined);

      expect(() => payloadFactory.create(opcode, buffer)).to.throw(
        ArgumentInvalidException,
        `Decoder not found for opcode 'CLIENT_HEARTBEAT_REQ' while creating payload from buffer: 74657374`,
      );
    });

    it('should create a payload from an object', function () {
      const object = { foo: 'bar' };
      const opcode = OPCode.fromName('CLIENT_HEARTBEAT_REQ');
      const buffer = Buffer.from('test');

      when(payloadObjectParserService.getEncoder(anything())).thenReturn(instance(encoder));
      when(encoder(anything())).thenReturn(buffer);

      const payload = payloadFactory.create(opcode, object);

      expect(payload).to.be.instanceOf(Payload);
      expect(payload.opcode).to.equal(opcode);
      expect(payload.object).to.equal(object);
      expect(payload.buffer).to.equal(buffer);

      verify(encoder(object)).once();
    });

    it('should throw an error when the encoder does not exist', function () {
      const object = { foo: 'bar' };
      const opcode = OPCode.fromName('CLIENT_HEARTBEAT_REQ');

      when(payloadObjectParserService.getEncoder(anything())).thenReturn(undefined);

      expect(() => payloadFactory.create(opcode, object)).to.throw(
        ArgumentInvalidException,
        `Encoder not found for opcode 'CLIENT_HEARTBEAT_REQ' while creating payload from object: {"foo":"bar"}`,
      );
    });
  });
});
