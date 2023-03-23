import { ArgumentInvalidException } from '@agnoc/toolkit';
import { Payload } from '../value-objects/payload.value-object';
import type { PayloadDataName } from '../constants/payloads.constant';
import type { OPCode } from '../domain-primitives/opcode.domain-primitive';
import type { PayloadDataParserService } from '../services/payload-data-parser.service';
import type { Mapper } from '@agnoc/toolkit';

export class PayloadMapper implements Mapper<Payload, Buffer> {
  constructor(private readonly payloadDataParserService: PayloadDataParserService) {}

  toDomain<Name extends PayloadDataName>(buffer: Buffer, opcode: OPCode<Name>): Payload<Name> {
    const decoder = this.payloadDataParserService.getDecoder(opcode.name as Name);

    if (!decoder) {
      throw new ArgumentInvalidException(
        `Decoder not found for opcode '${opcode.name}' while creating payload from buffer: ${buffer.toString('hex')}`,
      );
    }

    const data = decoder(buffer);

    return new Payload({
      opcode,
      data,
    });
  }

  fromDomain<Name extends PayloadDataName>(payload: Payload<Name>): Buffer {
    const encoder = this.payloadDataParserService.getEncoder(payload.opcode.name as Name);

    if (!encoder) {
      throw new ArgumentInvalidException(
        `Encoder not found for opcode '${payload.opcode.name}' while creating payload from data: ${JSON.stringify(
          payload.data,
        )}`,
      );
    }

    return encoder(payload.data);
  }
}
