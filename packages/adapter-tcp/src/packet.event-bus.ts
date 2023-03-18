import { TypedEmitter } from 'tiny-typed-emitter';
import type { PacketMessage } from './packet.message';
import type { PayloadObjectName } from '@agnoc/transport-tcp';

/** Events for the packet event bus. */
export type PacketEventBusEvents = {
  [Name in PayloadObjectName]: (message: PacketMessage<Name>) => void;
};

/** Event bus for packets. */
export class PacketEventBus extends TypedEmitter<PacketEventBusEvents> {}
