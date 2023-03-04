import { ID } from '@agnoc/toolkit';
import { OPCode } from './domain-primitives/opcode.domain-primitive';
import { PacketSequence } from './domain-primitives/packet-sequence.domain-primitive';
import { Payload } from './value-objects/payload.value-object';
import type { PacketProps } from './value-objects/packet.value-object';
import type { PayloadProps } from './value-objects/payload.value-object';

export function givenSomePayloadProps(): PayloadProps<'DEVICE_GETTIME_RSP'> {
  return {
    opcode: OPCode.fromName('DEVICE_GETTIME_RSP'),
    buffer: Buffer.alloc(0),
    object: { result: 0, body: { deviceTime: 1606129555, deviceTimezone: 3600 } },
  };
}

export function givenSomePacketProps(): PacketProps<'DEVICE_GETTIME_RSP'> {
  return {
    ctype: 2,
    flow: 1,
    deviceId: ID.generate(),
    userId: ID.generate(),
    sequence: PacketSequence.generate(),
    payload: new Payload(givenSomePayloadProps()),
  };
}
