import assert from 'assert';
import {
  ID,
  toStream,
  readWord,
  readByte,
  readLong,
  readShort,
  writeWord,
  writeByte,
  writeLong,
  writeShort,
  ValueObject,
  isPresent,
  ArgumentNotProvidedException,
  ArgumentInvalidException,
  BufferWriter,
} from '@agnoc/toolkit';
import { BigNumber } from './big-number.value-object';
import { OPCode } from './opcode.value-object';
import { Payload } from './payload.value-object';
import type { JSONPayload } from './payload.value-object';
import type { OPDecoderLiteral, OPCodeLiteral } from '../constants/opcodes.constant';

export interface PacketProps<Name extends OPDecoderLiteral> {
  ctype: number;
  flow: number;
  deviceId: ID;
  userId: ID;
  sequence: BigNumber;
  payload: Payload<Name>;
}

export interface JSONPacket<Name extends OPDecoderLiteral> {
  ctype: number;
  flow: number;
  deviceId: number;
  userId: number;
  sequence: string;
  payload: JSONPayload<Name>;
}

export function unpack<Name extends OPDecoderLiteral>(data: Buffer): PacketProps<Name> {
  const stream = toStream(data);
  const size = readWord(stream);

  assert(data.length >= size, 'unpack: missing data');

  const ctype = readByte(stream);
  const flow = readByte(stream);
  const deviceId = new ID(readWord(stream));
  const userId = new ID(readWord(stream));
  const sequence = new BigNumber(readLong(stream));
  const opcode = OPCode.fromCode(readShort(stream) as OPCodeLiteral);
  const payload = Payload.fromBuffer(
    opcode as OPCode<Name, OPCodeLiteral>,
    size > 24 ? (stream.read(size - 24) as Buffer) : Buffer.alloc(0),
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

export function pack<Name extends OPDecoderLiteral>(packet: PacketProps<Name>): Buffer {
  const size = 24 + Number(packet.payload?.buffer.length);
  const stream = new BufferWriter();

  writeWord(stream, size);
  writeByte(stream, packet.ctype);
  writeByte(stream, packet.flow);
  writeWord(stream, packet.deviceId.value);
  writeWord(stream, packet.userId.value);
  writeLong(stream, packet.sequence.value);
  writeShort(stream, packet.payload.opcode.value);

  stream.write(packet.payload.buffer);

  return stream.buffer;
}

export class Packet<Name extends OPDecoderLiteral> extends ValueObject<PacketProps<Name>> {
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

  override toString(): string {
    return [
      `[id: ${this.props.sequence.toString()}]`,
      `[ctype: ${this.props.ctype}]`,
      `[flow: ${this.props.flow}]`,
      `[userId: ${this.props.userId.toString()}]`,
      `[deviceId: ${this.props.deviceId.toString()}]`,
      `[opcode: ${this.props.payload.opcode.toString()}]`,
      this.props.payload.toString(),
    ].join(' ');
  }

  override toJSON(): JSONPacket<Name> {
    return super.toJSON() as JSONPacket<Name>;
  }

  protected validate(props: PacketProps<Name>): void {
    if (![props.ctype, props.flow, props.userId, props.deviceId, props.sequence, props.payload].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in packet constructor');
    }

    if (!(props.sequence instanceof BigNumber)) {
      throw new ArgumentInvalidException('Invalid sequence in packet constructor');
    }

    if (isPresent(props.payload) && !(props.payload instanceof Payload)) {
      throw new ArgumentInvalidException('Invalid payload in packet constructor');
    }
  }

  static fromBuffer<Name extends OPDecoderLiteral>(buffer: Buffer): Packet<Name> {
    return new Packet(unpack(buffer));
  }

  static fromJSON<Name extends OPDecoderLiteral>(serialized: JSONPacket<Name>): Packet<Name> {
    const props: PacketProps<Name> = {
      ctype: serialized.ctype,
      flow: serialized.flow,
      deviceId: new ID(serialized.deviceId),
      userId: new ID(serialized.userId),
      sequence: BigNumber.fromString(serialized.sequence),
      payload: Payload.fromJSON(serialized.payload),
    };

    return new Packet(props);
  }
}
