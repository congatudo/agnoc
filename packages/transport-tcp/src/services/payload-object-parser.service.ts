import { ArgumentInvalidException } from '@agnoc/toolkit';
import type { PayloadObjectFrom, PayloadObjectName } from '../constants/payloads.constant';
import type { Root, Type } from 'protobufjs/light';

export type Decoder<Name extends PayloadObjectName = PayloadObjectName> = (buffer: Buffer) => PayloadObjectFrom<Name>;
export type Encoder<Name extends PayloadObjectName = PayloadObjectName> = (object: PayloadObjectFrom<Name>) => Buffer;

export type EncoderMap<Name extends PayloadObjectName = PayloadObjectName> = Record<Name, Encoder<Name>>;
export type DecoderMap<Name extends PayloadObjectName = PayloadObjectName> = Record<Name, Decoder<Name>>;

export class PayloadObjectParserService {
  constructor(
    private readonly protoRoot: Root,
    private readonly decoders?: Partial<DecoderMap>,
    private readonly encoders?: Partial<EncoderMap>,
  ) {}

  getDecoder<Name extends PayloadObjectName>(name: Name): Decoder<Name> | undefined {
    const schema = this.protoRoot.get(name) as Type | null;

    if (schema) {
      return this.buildSchemaDecoder(name, schema) as Decoder<Name>;
    }

    return this.decoders?.[name] as Decoder<Name> | undefined;
  }

  getEncoder<Name extends PayloadObjectName>(name: Name): Encoder<Name> | undefined {
    const schema = this.protoRoot.get(name) as Type | null;

    if (schema) {
      return this.buildSchemaEncoder(name, schema) as Encoder<Name>;
    }

    return this.encoders?.[name] as Encoder<Name> | undefined;
  }

  private buildSchemaDecoder(name: PayloadObjectName, schema: Type): Decoder {
    const decoder = (buffer: Buffer) => {
      const message = schema.decode(buffer);

      return schema.toObject(message);
    };

    Object.defineProperty(decoder, 'name', { value: name });

    return decoder as Decoder;
  }

  private buildSchemaEncoder(name: PayloadObjectName, schema: Type): Encoder {
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
