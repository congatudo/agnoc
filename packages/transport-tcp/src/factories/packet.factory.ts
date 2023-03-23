import { OPCode } from '../domain-primitives/opcode.domain-primitive';
import { PacketSequence } from '../domain-primitives/packet-sequence.domain-primitive';
import { Packet } from '../value-objects/packet.value-object';
import { Payload } from '../value-objects/payload.value-object';
import type { PayloadDataFrom, PayloadDataName } from '../constants/payloads.constant';
import type { Factory, ID } from '@agnoc/toolkit';

/** The props to create a packet. */
export interface CreatePacketProps {
  userId: ID;
  deviceId: ID;
}

/** A factory to create packets. */
export class PacketFactory implements Factory<Packet> {
  /**
   * Creates a packet from a payload object.
   *
   * To use this method you must provider a `deviceId` and `userId` in the `props` object,
   * or a `Packet` object in the `packet` argument to copy the packet props from.
   */
  create<Name extends PayloadDataName>(
    name: Name,
    object: PayloadDataFrom<Name>,
    props: CreatePacketProps,
  ): Packet<Name>;
  create<Name extends PayloadDataName>(name: Name, object: PayloadDataFrom<Name>, packet: Packet): Packet<Name>;
  create<Name extends PayloadDataName>(
    name: Name,
    object: PayloadDataFrom<Name>,
    propsOrPacket: CreatePacketProps | Packet,
  ): Packet<Name> {
    if (propsOrPacket instanceof Packet) {
      return new Packet({
        ctype: propsOrPacket.ctype,
        flow: propsOrPacket.flow + 1,
        // This swap is intended.
        userId: propsOrPacket.deviceId,
        deviceId: propsOrPacket.userId,
        sequence: propsOrPacket.sequence,
        payload: new Payload({ opcode: OPCode.fromName(name), data: object }),
      });
    }

    return new Packet({
      ctype: 2,
      flow: 0,
      // This swap is intended.
      userId: propsOrPacket.deviceId,
      deviceId: propsOrPacket.userId,
      sequence: PacketSequence.generate(),
      payload: new Payload({ opcode: OPCode.fromName(name), data: object }),
    });
  }
}
