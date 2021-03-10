import { toStream } from "../utils/to-stream.util";
import { readByte, readLong, readShort, readWord } from "../utils/read.util";
import assert from "assert";
import { OPCode } from "../value-objects/opcode.value-object";
import { Payload } from "../value-objects/payload.value-object";
import { ValueObject } from "../base-classes/value-object.base-class";
import { isPresent } from "../utils/is-present.util";
import { BigNumber } from "../value-objects/big-number.value-object";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";

export interface PacketProps {
  ctype: number;
  flow: number;
  deviceId: number;
  userId: number;
  sequence: BigNumber;
  payload: Payload;
}

export function unpack(data: Buffer): PacketProps {
  const stream = toStream(data);
  const size = readWord(stream);

  assert(data.length >= size, "unpack: missing data");

  const ctype = readByte(stream);
  const flow = readByte(stream);
  const deviceId = readWord(stream);
  const userId = readWord(stream);
  const sequence = new BigNumber(readLong(stream));
  const opcode = OPCode.fromCode(readShort(stream));
  const payload = Payload.fromBuffer(
    opcode,
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

export function pack(packet: PacketProps): Buffer {
  const size = 24 + Number(packet.payload?.buffer.length);
  const data = Buffer.alloc(24);
  let offset = 0;

  offset = data.writeUInt32LE(size, offset);
  offset = data.writeUInt8(packet.ctype, offset);
  offset = data.writeUInt8(packet.flow, offset);
  offset = data.writeUInt32LE(packet.deviceId, offset);
  offset = data.writeUInt32LE(packet.userId, offset);
  offset = data.writeBigUInt64LE(packet.sequence.value, offset);
  data.writeUInt16LE(packet.payload.opcode.value, offset);

  return packet.payload ? Buffer.concat([data, packet.payload.buffer]) : data;
}

export class Packet extends ValueObject<PacketProps> {
  static fromBuffer(buffer: Buffer): Packet {
    return new Packet(unpack(buffer));
  }

  get ctype(): number {
    return this.props.ctype;
  }

  get flow(): number {
    return this.props.flow;
  }

  get userId(): number {
    return this.props.userId;
  }

  get deviceId(): number {
    return this.props.deviceId;
  }

  get sequence(): BigNumber {
    return this.props.sequence;
  }

  get payload(): Payload {
    return this.props.payload;
  }

  toBuffer(): Buffer {
    return pack(this.props);
  }

  toString(): string {
    return [
      `[ID: ${this.props.sequence.toString()}]`,
      `[Flow: ${this.props.flow}]`,
      `[UID: ${this.props.userId}]`,
      `[DID: ${this.props.deviceId}]`,
      `[OP: ${
        this.props.payload.opcode.name || this.props.payload.opcode.code
      }]`,
      this.props.payload ? this.props.payload.toString() : "{}",
    ].join(" ");
  }

  protected validate(props: PacketProps): void {
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
        "Wrong sequence in packet constructor"
      );
    }

    if (isPresent(props.payload) && !(props.payload instanceof Payload)) {
      throw new ArgumentInvalidException("Wrong payload in packet constructor");
    }
  }
}
