import { ArgumentInvalidException } from '@agnoc/toolkit';
import { Payload } from '../value-objects/payload.value-object';
import type { PayloadObjectName } from '../constants/payloads.constant';
import type { OPCode } from '../domain-primitives/opcode.domain-primitive';
import type { PayloadObjectParserService } from '../services/payload-object-parser.service';
import type { Mapper } from '@agnoc/toolkit';

export class PayloadMapper implements Mapper<Payload, Buffer> {
  constructor(private readonly payloadObjectParserService: PayloadObjectParserService) {}

  toDomain<Name extends PayloadObjectName>(buffer: Buffer, opcode: OPCode<Name>): Payload<Name> {
    const decoder = this.payloadObjectParserService.getDecoder(opcode.name as Name);

    if (!decoder) {
      throw new ArgumentInvalidException(
        `Decoder not found for opcode '${opcode.name}' while creating payload from buffer: ${buffer.toString('hex')}`,
      );
    }

    const object = decoder(buffer);

    return new Payload({
      opcode: opcode,
      object,
    });
  }

  fromDomain<Name extends PayloadObjectName>(payload: Payload<Name>): Buffer {
    const encoder = this.payloadObjectParserService.getEncoder(payload.opcode.name as Name);

    if (!encoder) {
      throw new ArgumentInvalidException(
        `Encoder not found for opcode '${payload.opcode.name}' while creating payload from object: ${JSON.stringify(
          payload.object,
        )}`,
      );
    }

    return encoder(payload.object);
  }
}
