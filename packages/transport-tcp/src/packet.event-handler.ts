import type { PayloadObjectName } from './constants/payloads.constant';
import type { PacketEventBusEventParameter, PacketEventBus } from './packet.event-bus';
import type { EventHandler } from '@agnoc/toolkit';

export type PacketEventHandleParameter<T extends PacketEventHandler> = PacketEventBusEventParameter<T['eventName']>;

/** Base class for packet event handlers. */
export abstract class PacketEventHandler implements EventHandler {
  constructor(private readonly eventBus: PacketEventBus) {}

  listen(): void {
    this.eventBus.on<this['eventName']>(this.eventName, (arg) => {
      void this.handle(arg as PacketEventHandleParameter<this>);
    });
  }

  /** The name of the event to listen to. */
  abstract eventName: PayloadObjectName;

  /** Handle the event. */
  abstract handle(arg: PacketEventHandleParameter<this>): Promise<void> | void;
}
