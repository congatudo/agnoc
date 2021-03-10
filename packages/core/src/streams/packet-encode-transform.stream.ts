import { Transform, TransformCallback } from "stream";
import { Packet, PacketProps } from "@agnoc/core/entities/packet.entity";
import {
  BigNumber,
  BigNumberSerialized,
} from "@agnoc/core/value-objects/big-number.value-object";
import { OPCodeSerialized } from "@agnoc/core/value-objects/opcode.value-object";
import {
  Payload,
  PayloadSerialized,
} from "@agnoc/core/value-objects/payload.value-object";

export interface SerializedPacket {
  ctype: number;
  flow: number;
  deviceId: number;
  userId: number;
  sequence: BigNumberSerialized;
  opcode: OPCodeSerialized;
  payload: PayloadSerialized;
}

export class PacketEncodeTransform extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(
    array: SerializedPacket[],
    _: BufferEncoding,
    done: TransformCallback
  ): void {
    array.forEach((serialized) => {
      const props: PacketProps = {
        ctype: serialized.ctype,
        flow: serialized.flow,
        deviceId: serialized.deviceId,
        userId: serialized.userId,
        sequence: BigNumber.fromJSON(serialized.sequence),
        payload: Payload.fromJSON(serialized.payload),
      };

      this.push(new Packet(props).toBuffer());
    });
    done();
  }
}
