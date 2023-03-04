import {
  BufferWriter,
  ID,
  readByte,
  readLong,
  readShort,
  readWord,
  toStream,
  writeByte,
  writeLong,
  writeShort,
  writeWord,
} from '@agnoc/toolkit';
import { assert } from 'chai';
import { OPCode } from '../domain-primitives/opcode.domain-primitive';
import { PacketSequence } from '../domain-primitives/packet-sequence.domain-primitive';
import { Packet } from '../value-objects/packet.value-object';
import type { OPCodeFrom } from '../constants/opcodes.constant';
import type { PayloadObjectName } from '../constants/payloads.constant';
import type { PayloadFactory } from '../factories/payload.factory';
import type { Mapper } from '@agnoc/toolkit';

export class PacketMapper implements Mapper<Packet<PayloadObjectName>, Buffer> {
  constructor(private readonly payloadFactory: PayloadFactory) {}

  toDomain<Name extends PayloadObjectName>(data: Buffer): Packet<Name> {
    const stream = toStream(data);
    const size = readWord(stream);

    assert(data.length >= size, 'unpack: missing data');

    const ctype = readByte(stream);
    const flow = readByte(stream);
    const deviceId = new ID(readWord(stream));
    const userId = new ID(readWord(stream));
    const sequence = new PacketSequence(readLong(stream));
    const opcode = OPCode.fromCode(readShort(stream) as OPCodeFrom<Name>);
    const buffer = size > 24 ? (stream.read(size - 24) as Buffer) : Buffer.alloc(0);
    const payload = this.payloadFactory.create(opcode, buffer);

    return new Packet({
      ctype,
      flow,
      deviceId,
      userId,
      sequence,
      payload,
    });
  }

  fromDomain(packet: Packet<PayloadObjectName>): Buffer {
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
}
