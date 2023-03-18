import type { EventBus, EventHandler } from '@agnoc/toolkit';

/** Manages event handlers. */
export class EventHandlerManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly eventBus: EventBus<any>) {}

  register(...eventHandlers: EventHandler[]): void {
    eventHandlers.forEach((eventHandler) => this.addEventHandler(eventHandler));
  }

  private addEventHandler(eventHandler: EventHandler): void {
    this.eventBus.on(eventHandler.eventName, eventHandler.handle.bind(eventHandler));
  }
}
