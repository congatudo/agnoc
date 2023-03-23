import type { PacketMessage } from './packet.message';
import type { EventHandler } from '@agnoc/toolkit';
import type { PayloadDataName } from '@agnoc/transport-tcp';

/** Base class for packet event handlers. */
export abstract class PacketEventHandler implements EventHandler {
  /** The name of the event to listen to. */
  abstract forName: PayloadDataName;

  /** Handle the event. */
  abstract handle(message: PacketMessage<this['forName']>): void;
}
