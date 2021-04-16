import { toStream } from "../utils/to-stream.util";
import { readByte, readLong, readShort, readWord } from "../utils/read.util";
import assert from "assert";
import { OPCode } from "./opcode.value-object";
import { Payload, PayloadSerialized } from "./payload.value-object";
import { ValueObject } from "../base-classes/value-object.base";
import { isPresent } from "../utils/is-present.util";
import { BigNumber, BigNumberSerialized } from "./big-number.value-object";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ID, IDSerialized } from "./id.value-object";
import { OPCodeLiteral, OPDecoderLiteral } from "../constants/opcodes.constant";

export interface PacketProps<Name extends OPDecoderLiteral> {
  ctype: number;
  flow: number;
  deviceId: ID;
  userId: ID;
  sequence: BigNumber;
  payload: Payload<Name>;
}

export interface PacketSerialized<Name extends OPDecoderLiteral> {
  ctype: number;
  flow: number;
  deviceId: IDSerialized;
  userId: IDSerialized;
  sequence: BigNumberSerialized;
  payload: PayloadSerialized<Name>;
}

export function unpack<Name extends OPDecoderLiteral>(
  data: Buffer
): PacketProps<Name> {
  const stream = toStream(data);
  const size = readWord(stream);

  assert(data.length >= size, "unpack: missing data");

  const ctype = readByte(stream);
  const flow = readByte(stream);
  const deviceId = new ID(readWord(stream));
  const userId = new ID(readWord(stream));
  const sequence = new BigNumber(readLong(stream));
  const opcode = OPCode.fromCode(readShort(stream) as OPCodeLiteral);
  const payload = Payload.fromBuffer(
    opcode as OPCode<Name, OPCodeLiteral>,
    size > 24 ? (stream.read(size - 24) as Buffer) : Buffer.alloc(0)
  );

  return {
    ctype,
    flow,
    deviceId,
    userId,
    sequence,
    payload,
  };
}

export function pack<Name extends OPDecoderLiteral>(
  packet: PacketProps<Name>
): Buffer {
  const size = 24 + Number(packet.payload?.buffer.length);
  const data = Buffer.alloc(24);
  let offset = 0;

  offset = data.writeUInt32LE(size, offset);
  offset = data.writeUInt8(packet.ctype, offset);
  offset = data.writeUInt8(packet.flow, offset);
  offset = data.writeUInt32LE(packet.deviceId.value, offset);
  offset = data.writeUInt32LE(packet.userId.value, offset);
  offset = data.writeBigUInt64LE(packet.sequence.value, offset);
  data.writeUInt16LE(packet.payload.opcode.value, offset);

  return packet.payload ? Buffer.concat([data, packet.payload.buffer]) : data;
}

export class Packet<Name extends OPDecoderLiteral> extends ValueObject<
  PacketProps<Name>
> {
  get ctype(): number {
    return this.props.ctype;
  }

  get flow(): number {
    return this.props.flow;
  }

  get userId(): ID {
    return this.props.userId;
  }

  get deviceId(): ID {
    return this.props.deviceId;
  }

  get sequence(): BigNumber {
    return this.props.sequence;
  }

  get payload(): Payload<Name> {
    return this.props.payload;
  }

  toBuffer(): Buffer {
    return pack(this.props);
  }

  toString(): string {
    return [
      `[id: ${this.props.sequence.toString()}]`,
      `[ctype: ${this.props.ctype}]`,
      `[flow: ${this.props.flow}]`,
      `[userId: ${this.props.userId.toString()}]`,
      `[deviceId: ${this.props.deviceId.toString()}]`,
      `[opcode: ${this.props.payload.opcode.toString()}]`,
      this.props.payload.toString(),
    ].join(" ");
  }

  toJSON(): PacketSerialized<Name> {
    return super.toJSON() as PacketSerialized<Name>;
  }

  protected validate(props: PacketProps<Name>): void {
    if (
      ![
        props.ctype,
        props.flow,
        props.userId,
        props.deviceId,
        props.sequence,
        props.payload,
      ].map(isPresent)
    ) {
      throw new ArgumentNotProvidedException(
        "Missing property in packet constructor"
      );
    }

    if (!(props.sequence instanceof BigNumber)) {
      throw new ArgumentInvalidException(
        "Invalid sequence in packet constructor"
      );
    }

    if (isPresent(props.payload) && !(props.payload instanceof Payload)) {
      throw new ArgumentInvalidException(
        "Invalid payload in packet constructor"
      );
    }
  }

  static fromBuffer<Name extends OPDecoderLiteral>(
    buffer: Buffer
  ): Packet<Name> {
    return new Packet(unpack(buffer));
  }

  static fromJSON<Name extends OPDecoderLiteral>(
    serialized: PacketSerialized<Name>
  ): Packet<Name> {
    const props: PacketProps<Name> = {
      ctype: serialized.ctype,
      flow: serialized.flow,
      deviceId: ID.fromJSON(serialized.deviceId),
      userId: ID.fromJSON(serialized.userId),
      sequence: BigNumber.fromJSON(serialized.sequence),
      payload: Payload.fromJSON(serialized.payload),
    };

    return new Packet(props);
  }
}
