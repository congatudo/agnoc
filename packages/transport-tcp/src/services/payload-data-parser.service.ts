import { ArgumentInvalidException } from '@agnoc/toolkit';
import type { PayloadDataFrom, PayloadDataName } from '../constants/payloads.constant';
import type { Root, Type } from 'protobufjs/light';

export type Decoder<Name extends PayloadDataName = PayloadDataName> = (buffer: Buffer) => PayloadDataFrom<Name>;
export type Encoder<Name extends PayloadDataName = PayloadDataName> = (object: PayloadDataFrom<Name>) => Buffer;

export type EncoderMap<Name extends PayloadDataName = PayloadDataName> = Record<Name, Encoder<Name>>;
export type DecoderMap<Name extends PayloadDataName = PayloadDataName> = Record<Name, Decoder<Name>>;

/** Service to encde and decode payload objects. */
export class PayloadDataParserService {
  constructor(
    private readonly protoRoot: Root,
    private readonly decoders?: Partial<DecoderMap>,
    private readonly encoders?: Partial<EncoderMap>,
  ) {}

  /** Returns a decoder for a payload object. */
  getDecoder<Name extends PayloadDataName>(name: Name): Decoder<Name> | undefined {
    const schema = this.protoRoot.get(name) as Type | null;

    if (schema) {
      return this.buildSchemaDecoder(name, schema) as Decoder<Name>;
    }

    return this.decoders?.[name] as Decoder<Name> | undefined;
  }

  /** Returns an encoder for a payload object. */
  getEncoder<Name extends PayloadDataName>(name: Name): Encoder<Name> | undefined {
    const schema = this.protoRoot.get(name) as Type | null;

    if (schema) {
      return this.buildSchemaEncoder(name, schema) as Encoder<Name>;
    }

    return this.encoders?.[name] as Encoder<Name> | undefined;
  }

  private buildSchemaDecoder(name: PayloadDataName, schema: Type): Decoder {
    const decoder = (buffer: Buffer) => {
      const message = schema.decode(buffer);

      return schema.toObject(message);
    };

    Object.defineProperty(decoder, 'name', { value: name });

    return decoder as Decoder;
  }

  private buildSchemaEncoder(name: PayloadDataName, schema: Type): Encoder {
    const encoder = (object: Buffer) => {
      const err = schema.verify(object);

      if (err) {
        throw new ArgumentInvalidException(
          `Cannot encode a payload for opcode '${name}' for object '${JSON.stringify(object)}': ${err}`,
        );
      }

      const message = schema.create(object);

      return Buffer.from(schema.encode(message).finish());
    };

    Object.defineProperty(encoder, 'name', { value: name });

    return encoder as Encoder;
  }
}
