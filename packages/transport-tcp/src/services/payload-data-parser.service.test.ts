import { ArgumentInvalidException } from '@agnoc/toolkit';
import { anything, fnmock, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { PayloadDataParserService } from './payload-data-parser.service';
import type { Decoder, DecoderMap, Encoder, EncoderMap } from './payload-data-parser.service';
import type { PayloadData } from '../constants/payloads.constant';
import type { MapInfo } from '../decoders/map.interface';
import type { Root, Type, Message, Writer } from 'protobufjs/light';

describe('PayloadDataParserService', function () {
  let service: PayloadDataParserService;
  let protoRoot: Root;
  let protoType: Type;
  let protoMessage: Message;
  let protoWriter: Writer;
  let payloadData: PayloadData;
  let buffer: Buffer;
  let customDecoders: Partial<DecoderMap>;
  let customDecoder: Decoder;
  let customEncoders: Partial<EncoderMap>;
  let customEncoder: Encoder;

  beforeEach(function () {
    protoRoot = imock();
    protoType = imock();
    protoMessage = imock();
    protoWriter = imock();
    payloadData = instance(imock());
    buffer = Buffer.from('example');
    customDecoder = fnmock();
    customDecoders = { DEVICE_MAPID_GET_GLOBAL_INFO_RSP: instance(customDecoder) };
    customEncoder = fnmock();
    customEncoders = { DEVICE_MAPID_GET_GLOBAL_INFO_RSP: instance(customEncoder) };
    service = new PayloadDataParserService(instance(protoRoot), customDecoders, customEncoders);
  });

  describe('#getDecoder()', function () {
    it('should return a decoder function from the protobuf schema', function () {
      when(protoRoot.get(anything())).thenReturn(instance(protoType));
      when(protoType.decode(anything())).thenReturn(instance(protoMessage));
      when(protoType.toObject(anything())).thenReturn(payloadData);
      when(customDecoder(anything())).thenReturn({});

      const fn = service.getDecoder('CLIENT_HEARTBEAT_REQ');
      const ret = fn?.(buffer);

      expect(ret).to.equal(payloadData);

      verify(protoRoot.get('CLIENT_HEARTBEAT_REQ')).once();
      verify(protoType.decode(buffer)).once();
      verify(customDecoder(anything())).never();
    });

    it('should return a decoder function from a custom opcode', function () {
      when(protoRoot.get(anything())).thenReturn(null);
      when(protoType.decode(anything())).thenReturn(instance(protoMessage));
      when(protoType.toObject(anything())).thenReturn({});
      when(customDecoder(anything())).thenReturn(payloadData);

      const fn = service.getDecoder('DEVICE_MAPID_GET_GLOBAL_INFO_RSP');
      const ret = fn?.(buffer);

      expect(ret).to.equal(payloadData);

      verify(protoRoot.get('DEVICE_MAPID_GET_GLOBAL_INFO_RSP')).once();
      verify(protoType.decode(anything())).never();
      verify(customDecoder(buffer)).once();
    });
  });

  describe('#getEncoder()', function () {
    it('should return a encoder function from the protobuf schema', function () {
      when(protoRoot.get(anything())).thenReturn(instance(protoType));
      when(protoType.verify(anything())).thenReturn(null);
      when(protoType.create(anything())).thenReturn(instance(protoMessage));
      when(protoType.encode(anything())).thenReturn(instance(protoWriter));
      when(protoWriter.finish()).thenReturn(buffer);
      when(customEncoder(anything())).thenReturn(Buffer.alloc(0));

      const fn = service.getEncoder('CLIENT_HEARTBEAT_REQ');
      const ret = fn?.(payloadData);

      expect(ret).to.exist;
      expect(Buffer.compare(ret as Buffer, buffer)).to.equal(0);

      verify(protoRoot.get('CLIENT_HEARTBEAT_REQ')).once();
      verify(protoType.verify(payloadData)).once();
      verify(protoType.create(payloadData)).once();
      verify(customEncoder(anything())).never();
    });

    it('should throw an error when the verify fails', function () {
      when(protoRoot.get(anything())).thenReturn(instance(protoType));
      when(protoType.verify(anything())).thenReturn('Verify error');
      when(protoType.create(anything())).thenReturn(instance(protoMessage));
      when(protoType.encode(anything())).thenReturn(instance(protoWriter));
      when(protoWriter.finish()).thenReturn(buffer);
      when(customEncoder(anything())).thenReturn(Buffer.alloc(0));

      const fn = service.getEncoder('CLIENT_HEARTBEAT_REQ');
      expect(() => fn?.(payloadData)).to.throw(
        ArgumentInvalidException,
        `Cannot encode a payload for opcode 'CLIENT_HEARTBEAT_REQ' for object 'null': Verify error`,
      );

      verify(protoRoot.get('CLIENT_HEARTBEAT_REQ')).once();
      verify(protoType.verify(payloadData)).once();
      verify(protoType.create(anything())).never();
      verify(customEncoder(anything())).never();
    });

    it('should return a encoder function from a custom opcode', function () {
      when(protoRoot.get(anything())).thenReturn(null);
      when(protoType.verify(anything())).thenReturn(null);
      when(protoType.create(anything())).thenReturn(instance(protoMessage));
      when(protoType.encode(anything())).thenReturn(instance(protoWriter));
      when(protoWriter.finish()).thenReturn(Buffer.alloc(0));
      when(customEncoder(anything())).thenReturn(buffer);

      const fn = service.getEncoder('DEVICE_MAPID_GET_GLOBAL_INFO_RSP');
      const ret = fn?.(payloadData as MapInfo);

      expect(ret).to.exist;
      expect(Buffer.compare(ret as Buffer, buffer)).to.equal(0);

      verify(protoRoot.get('DEVICE_MAPID_GET_GLOBAL_INFO_RSP')).once();
      verify(protoType.verify(anything())).never();
      verify(protoType.create(anything())).never();
      verify(customEncoder(payloadData)).once();
    });
  });
});