import type { EventHandler } from './event-handler.base';
import type { EventEmitter } from 'stream';

/** Manages event handlers. */
export class EventHandlerManager {
  private readonly eventHandlers: EventHandler[] = [];
  constructor(private readonly eventBus: EventEmitter) {}

  register(...eventHandlers: EventHandler[]): void {
    eventHandlers.forEach((eventHandler) => this.addEventHandler(eventHandler));
  }

  private addEventHandler(eventHandler: EventHandler): void {
    this.eventHandlers.push(eventHandler);
    this.eventBus.on(eventHandler.eventName, eventHandler.handle.bind(eventHandler));
  }
}
