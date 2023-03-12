import { Transform } from 'stream';
import { ID } from '@agnoc/toolkit';
import { OPCode, Packet, PacketSequence } from '@agnoc/transport-tcp';
import type { PayloadObjectName, PacketProps, JSONPayload, PacketMapper, PayloadFactory } from '@agnoc/transport-tcp';
import type { TransformCallback } from 'stream';

export class PacketEncodeTransform extends Transform {
  constructor(private readonly packetMapper: PacketMapper, private readonly payloadFactory: PayloadFactory) {
    super({ objectMode: true });
  }

  override _transform(array: JSONPacket[], _: BufferEncoding, done: TransformCallback): void {
    array.forEach((serialized) => {
      this.push(this.packetMapper.fromDomain(this.buildPacketFromJSON(serialized)));
    });
    done();
  }

  buildPacketFromJSON<Name extends PayloadObjectName>(serialized: JSONPacket<Name>): Packet<Name> {
    const props: PacketProps<Name> = {
      ctype: serialized.ctype,
      flow: serialized.flow,
      deviceId: new ID(serialized.deviceId),
      userId: new ID(serialized.userId),
      sequence: PacketSequence.fromString(serialized.sequence),
      payload: this.payloadFactory.create(OPCode.fromName(serialized.payload.opcode), serialized.payload.object),
    };

    return new Packet(props);
  }
}

export interface JSONPacket<Name extends PayloadObjectName = PayloadObjectName> {
  ctype: number;
  flow: number;
  deviceId: number;
  userId: number;
  sequence: string;
  payload: JSONPayload<Name>;
}
