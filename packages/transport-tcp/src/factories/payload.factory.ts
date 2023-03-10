import { ArgumentInvalidException } from '@agnoc/toolkit';
import { Payload } from '../value-objects/payload.value-object';
import type { PayloadObjectFrom, PayloadObjectName } from '../constants/payloads.constant';
import type { OPCode } from '../domain-primitives/opcode.domain-primitive';
import type { PayloadObjectParserService } from '../services/payload-object-parser.service';
import type { Factory } from '@agnoc/toolkit';

/** Factory for creating payloads. */
export class PayloadFactory implements Factory<Payload<PayloadObjectName>> {
  constructor(private readonly payloadObjectParserService: PayloadObjectParserService) {}

  /** Creates a payload from a buffer or an object. */
  create<Name extends PayloadObjectName>(opcode: OPCode<Name>, buffer: Buffer): Payload<Name>;
  create<Name extends PayloadObjectName>(opcode: OPCode<Name>, object: PayloadObjectFrom<Name>): Payload<Name>;
  create<Name extends PayloadObjectName>(
    opcode: OPCode<Name>,
    bufferOrObject: Buffer | PayloadObjectFrom<Name>,
  ): Payload<Name> {
    if (bufferOrObject instanceof Buffer) {
      return this.createFromBuffer(opcode, bufferOrObject);
    }

    return this.createFromObject(opcode, bufferOrObject);
  }

  private createFromBuffer<Name extends PayloadObjectName>(opcode: OPCode<Name>, buffer: Buffer): Payload<Name> {
    const decoder = this.payloadObjectParserService.getDecoder(opcode.name as Name);

    if (!decoder) {
      throw new ArgumentInvalidException(
        `Decoder not found for opcode '${opcode.name}' while creating payload from buffer: ${buffer.toString('hex')}`,
      );
    }

    const object = decoder(buffer);

    return new Payload({
      opcode: opcode,
      buffer,
      object,
    });
  }

  private createFromObject<Name extends PayloadObjectName>(
    opcode: OPCode<Name>,
    object: PayloadObjectFrom<Name>,
  ): Payload<Name> {
    const encoder = this.payloadObjectParserService.getEncoder(opcode.name as Name);

    if (!encoder) {
      throw new ArgumentInvalidException(
        `Encoder not found for opcode '${opcode.name}' while creating payload from object: ${JSON.stringify(object)}`,
      );
    }

    const buffer = encoder(object);

    return new Payload({
      opcode: opcode,
      buffer,
      object,
    });
  }
}
