import type { EventBus } from './base-classes/event-bus.base';
import type { EventHandler } from './base-classes/event-handler.base';

/** Manages event handlers. */
export class EventHandlerRegistry {
  constructor(private readonly eventBus: EventBus) {}

  register(...eventHandlers: EventHandler[]): void {
    eventHandlers.forEach((eventHandler) => this.addEventHandler(eventHandler));
  }

  private addEventHandler(eventHandler: EventHandler): void {
    this.eventBus.on(eventHandler.eventName, eventHandler.handle.bind(eventHandler));
  }
}
