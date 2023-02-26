import { hasKey, ArgumentInvalidException, isObject, ValueObject } from '@agnoc/toolkit';
import protobuf from 'protobufjs/light';
import schema from '../../schemas/schema.json';
import { decodeArea } from '../decoders/area.decoder';
import { decodeChargePosition } from '../decoders/charge-position.decoder';
import { decodeMap } from '../decoders/map.decoder';
import { decodeRobotPosition } from '../decoders/robot-position.decoder';
import { OPCode } from './opcode.value-object';
import type { OPDecoderLiteral, OPCodeLiteral, OPDecoders } from '../constants/opcodes.constant';
import type { INamespace } from 'protobufjs/light';

export interface PayloadProps<Name extends OPDecoderLiteral> {
  opcode: OPCode<Name, OPCodeLiteral>;
  buffer: Buffer;
  object: OPDecoders[Name];
}

export interface PayloadSerialized<Name extends OPDecoderLiteral> {
  opcode: Name;
  object: OPDecoders[Name];
}

type Decoder = (buffer: Buffer) => unknown;

const root = protobuf.Root.fromJSON(schema as INamespace);
const decoders = {
  DEVICE_MAPID_PUSH_POSITION_INFO: decodeRobotPosition,
  DEVICE_MAPID_PUSH_CHARGE_POSITION_INFO: decodeChargePosition,
  DEVICE_MAPID_GET_GLOBAL_INFO_RSP: decodeMap,
  DEVICE_MAPID_PUSH_MAP_INFO: decodeMap,
  DEVICE_MAPID_PUSH_ALL_MEMORY_MAP_INFO: decodeArea,
} as const;

function fromObject<Name extends OPDecoderLiteral>(
  opcode: OPCode<Name, OPCodeLiteral>,
  object: OPDecoders[Name],
): Buffer {
  if (!object) {
    return Buffer.alloc(0);
  }

  if (!opcode.name || !hasKey(root, opcode.name)) {
    throw new ArgumentInvalidException(
      `Unable to create payload from unknown opcode ${opcode.toString()} from object ${JSON.stringify(object)}`,
    );
  }

  const schema = root.lookupType(opcode.name);
  const err = schema.verify(object);

  if (err) {
    throw new ArgumentInvalidException(`Unable to create payload from object: ${err}`);
  }

  const message = schema.create(object);

  return Buffer.from(schema.encode(message).finish());
}

function fromBuffer<Name extends OPDecoderLiteral>(
  opcode: OPCode<Name, OPCodeLiteral>,
  buffer: Buffer,
): OPDecoders[Name] {
  if (!opcode.name) {
    throw new ArgumentInvalidException(
      `Unable to create payload from unknown opcode ${opcode.toString()} from buffer ${buffer.toString('hex')}`,
    );
  }

  if (hasKey(decoders, opcode.name)) {
    const decoder = decoders[opcode.name] as Decoder;

    return decoder(buffer) as OPDecoders[Name];
  }

  if (hasKey(root, opcode.name)) {
    const schema = root.lookupType(opcode.name);
    const message = schema.decode(buffer);

    return schema.toObject(message) as OPDecoders[Name];
  }

  throw new ArgumentInvalidException(
    `Unable to find decoder for opcode ${opcode.toString()} with buffer ${buffer.toString('hex')}`,
  );
}

function filterProperties(_: string, value: unknown) {
  if (isObject(value) && value.type === 'Buffer') {
    return '[Buffer]';
  }

  return value;
}

export class Payload<Name extends OPDecoderLiteral> extends ValueObject<PayloadProps<Name>> {
  constructor({ opcode, buffer, object }: PayloadProps<Name>) {
    super({
      opcode,
      buffer,
      object,
    });
  }

  public get opcode(): OPCode<Name, OPCodeLiteral> {
    return this.props.opcode;
  }

  public get buffer(): Buffer {
    return this.props.buffer;
  }

  public get object(): OPDecoders[Name] {
    return this.props.object;
  }

  public override toString(): string {
    return JSON.stringify(this.object, filterProperties);
  }

  public override toJSON(): PayloadSerialized<Name> {
    return { opcode: this.props.opcode.toJSON(), object: this.props.object };
  }

  protected validate(props: PayloadProps<Name>): void {
    if (!(props.opcode instanceof OPCode)) {
      throw new ArgumentInvalidException('Wrong opcode in payload constructor');
    }
  }

  public static fromJSON<Name extends OPDecoderLiteral>(obj: PayloadSerialized<Name>): Payload<Name> {
    const opcode = OPCode.fromName(obj.opcode);

    return this.fromObject(opcode as OPCode<Name, OPCodeLiteral>, obj.object);
  }

  public static fromBuffer<Name extends OPDecoderLiteral>(
    opcode: OPCode<Name, OPCodeLiteral>,
    buffer: Buffer,
  ): Payload<Name> {
    const object = fromBuffer(opcode, buffer);

    return new Payload({
      opcode,
      buffer,
      object,
    });
  }

  public static fromObject<Name extends OPDecoderLiteral>(
    opcode: OPCode<Name, OPCodeLiteral>,
    object: OPDecoders[Name],
  ): Payload<Name> {
    const buffer = fromObject(opcode, object);

    return new Payload({
      opcode,
      buffer,
      object,
    });
  }
}
