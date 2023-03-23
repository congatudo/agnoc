import { EventBus } from '@agnoc/toolkit';
import type { PacketMessage } from './packet.message';
import type { PayloadDataName } from '@agnoc/transport-tcp';

/** Events for the packet event bus. */
export type PacketEventBusEvents = {
  [Name in PayloadDataName]: PacketMessage<Name>;
} & {
  [key: string]: PacketMessage;
};

/** Event bus for packets. */
export class PacketEventBus extends EventBus<PacketEventBusEvents> {}
