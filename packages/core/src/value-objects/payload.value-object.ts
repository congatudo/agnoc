import { ValueObject } from "../base-classes/value-object.base";
import { OPCode, OPCodeSerialized } from "./opcode.value-object";
import schema from "../../schemas/schema.json";
import protobuf from "protobufjs/light";
import { hasKey } from "../utils/has-key.util";
import { isObject } from "../utils/is-object.util";
import { decodeRobotPosition } from "../decoders/robot-position.decoder";
import { decodeChargePosition } from "../decoders/charge-position.decoder";
import { decodeMap } from "../decoders/map.decoder";
import { decodeArea } from "../decoders/area.decoder";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ObjectLiteral } from "../types/object-literal.type";

export interface PayloadProps {
  opcode: OPCode;
  buffer: Buffer;
  object: unknown;
}

export interface PayloadSerialized {
  opcode: OPCodeSerialized;
  object: unknown;
}

type Decoder = (buffer: Buffer) => unknown;

const root = protobuf.Root.fromJSON(schema);
const decoders = {
  DEVICE_MAP_ID_PUSH_POSITION_INFO: decodeRobotPosition,
  DEVICE_MAP_ID_PUSH_CHARGE_POSITION_INFO: decodeChargePosition,
  DEVICE_MAP_ID_GET_GLOBAL_INFO_RSP: decodeMap,
  DEVICE_MAP_ID_PUSH_MAP_INFO: decodeMap,
  DEVICE_MAP_ID_PUSH_ALL_MEMORY_MAP_INFO: decodeArea,
} as const;

function fromObject(opcode: OPCode, object: ObjectLiteral): Buffer {
  if (!object) {
    return Buffer.alloc(0);
  }

  if (!opcode.name || !hasKey(root, opcode.name)) {
    throw new ArgumentInvalidException(
      `Unable to create payload from unknown opcode ${opcode.toString()} from object ${JSON.stringify(
        object
      )}`
    );
  }

  const schema = root.lookupType(opcode.name);
  const err = schema.verify(object);

  if (err) {
    throw new ArgumentInvalidException(
      `Unable to create payload from object: ${err}`
    );
  }

  const message = schema.create(object);

  return Buffer.from(schema.encode(message).finish());
}

function fromBuffer(opcode: OPCode, buffer: Buffer): unknown {
  if (!opcode.name) {
    throw new ArgumentInvalidException(
      `Unable to create payload from unknown opcode ${opcode.toString()} from buffer ${buffer.toString(
        "hex"
      )}`
    );
  }

  if (hasKey(decoders, opcode.name)) {
    const decoder = decoders[opcode.name] as Decoder;

    return decoder(buffer);
  }

  if (hasKey(root, opcode.name)) {
    const schema = root.lookupType(opcode.name);
    const message = schema.decode(buffer);

    return schema.toObject(message);
  }

  throw new ArgumentInvalidException(
    `Unable to find decoder for opcode ${opcode.toString()} with buffer ${buffer.toString(
      "hex"
    )}`
  );
}

function filterProperties(_: string, value: unknown) {
  if (isObject(value) && value.type === "Buffer") {
    return "[Buffer]";
  }

  return value;
}

export class Payload extends ValueObject<PayloadProps> {
  constructor({ opcode, buffer, object }: PayloadProps) {
    super({
      opcode,
      buffer,
      object,
    });
  }

  public get opcode(): OPCode {
    return this.props.opcode;
  }

  public get buffer(): Buffer {
    return this.props.buffer;
  }

  public get object(): unknown {
    return this.props.object;
  }

  public toString(): string {
    return JSON.stringify(this.object, filterProperties);
  }

  public toJSON(): PayloadSerialized {
    return { opcode: this.props.opcode.toJSON(), object: this.props.object };
  }

  protected validate(props: PayloadProps): void {
    if (!(props.opcode instanceof OPCode)) {
      throw new ArgumentInvalidException("Wrong opcode in payload constructor");
    }
  }

  public static fromJSON(obj: PayloadSerialized): Payload {
    const opcode = OPCode.fromJSON(obj.opcode);

    return this.fromObject(opcode, obj.object as ObjectLiteral);
  }

  public static fromBuffer(opcode: OPCode, buffer: Buffer): Payload {
    const object = fromBuffer(opcode, buffer);

    return new Payload({
      opcode,
      buffer,
      object,
    });
  }

  public static fromObject(opcode: OPCode, object: ObjectLiteral): Payload {
    const buffer = fromObject(opcode, object);

    return new Payload({
      opcode,
      buffer,
      object,
    });
  }
}
