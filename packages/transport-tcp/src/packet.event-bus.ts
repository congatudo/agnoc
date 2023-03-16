import { TypedEmitter } from 'tiny-typed-emitter';
import type { PayloadObjectName } from './constants/payloads.constant';
import type { PacketSocket } from './packet.socket';
import type { Packet } from './value-objects/packet.value-object';

/** Parameter for the packet event bus event. */
export type PacketEventBusEventParameter<Name extends PayloadObjectName> = {
  packet: Packet<Name>;
  socket: PacketSocket;
};

/** Events for the packet event bus. */
export type PacketEventBusEvents = {
  [Name in PayloadObjectName]: ({ packet, socket }: PacketEventBusEventParameter<Name>) => void;
};

/** Event bus for packets. */
export class PacketEventBus extends TypedEmitter<PacketEventBusEvents> {}
