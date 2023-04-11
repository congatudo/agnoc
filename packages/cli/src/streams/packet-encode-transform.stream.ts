import { Transform } from 'stream';
import { ID } from '@agnoc/toolkit';
import { OPCode, Packet, PacketSequence, Payload } from '@agnoc/transport-tcp';
import type { PayloadDataName, PacketProps, JSONPayload, PacketMapper } from '@agnoc/transport-tcp';
import type { TransformCallback } from 'stream';

export class PacketEncodeTransform extends Transform {
  constructor(private readonly packetMapper: PacketMapper) {
    super({ objectMode: true });
  }

  override _transform(array: JSONPacket[], _: BufferEncoding, done: TransformCallback): void {
    array.forEach((serialized) => {
      this.push(this.packetMapper.fromDomain(this.buildPacketFromJSON(serialized)));
    });
    done();
  }

  buildPacketFromJSON<Name extends PayloadDataName>(serialized: JSONPacket<Name>): Packet<Name> {
    const props: PacketProps<Name> = {
      ctype: serialized.ctype,
      flow: serialized.flow,
      deviceId: new ID(serialized.deviceId),
      userId: new ID(serialized.userId),
      sequence: PacketSequence.fromString(serialized.sequence),
      payload: new Payload({ opcode: OPCode.fromName(serialized.payload.opcode), data: serialized.payload.data }),
    };

    return new Packet(props);
  }
}

export interface JSONPacket<Name extends PayloadDataName = PayloadDataName> {
  ctype: number;
  flow: number;
  deviceId: number;
  userId: number;
  sequence: string;
  payload: JSONPayload<Name>;
}
