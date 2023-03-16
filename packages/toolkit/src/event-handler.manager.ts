import type { EventHandler } from './base-classes/event-handler.base';

/** Manages event handlers. */
export class EventHandlerManager {
  constructor(private readonly eventHandlers: EventHandler[]) {
    this.addListeners();
  }

  private addListeners() {
    this.eventHandlers.forEach((eventHandler) => {
      eventHandler.listen();
    });
  }
}
