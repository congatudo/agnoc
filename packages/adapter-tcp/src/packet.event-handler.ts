import type { EventHandler } from './event-handler.base';
import type { PacketMessage } from './packet.message';
import type { PayloadObjectName } from '@agnoc/transport-tcp';

export type PacketEventHandleParameter<T extends PacketEventHandler> = PacketMessage<T['eventName']>;

/** Base class for packet event handlers. */
export abstract class PacketEventHandler implements EventHandler {
  /** The name of the event to listen to. */
  abstract eventName: PayloadObjectName;

  /** Handle the event. */
  abstract handle(message: PacketEventHandleParameter<this>): void;
}
