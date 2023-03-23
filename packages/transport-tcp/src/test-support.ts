import { ID } from '@agnoc/toolkit';
import { OPCode } from './domain-primitives/opcode.domain-primitive';
import { PacketSequence } from './domain-primitives/packet-sequence.domain-primitive';
import { Payload } from './value-objects/payload.value-object';
import type { PacketProps } from './value-objects/packet.value-object';
import type { PayloadProps } from './value-objects/payload.value-object';

export function givenSomePayloadProps(): PayloadProps<'DEVICE_GETTIME_RSP'> {
  return {
    opcode: OPCode.fromName('DEVICE_GETTIME_RSP'),
    data: { result: 0, body: { deviceTime: 1606129555, deviceTimezone: 3600 } },
  };
}

export function givenSomePacketProps(): PacketProps<'DEVICE_GETTIME_RSP'> {
  return {
    ctype: 2,
    flow: 1,
    deviceId: new ID(3),
    userId: new ID(4),
    sequence: PacketSequence.fromString('fb3dd1ebc0e6c58f'),
    payload: new Payload(givenSomePayloadProps()),
  };
}
