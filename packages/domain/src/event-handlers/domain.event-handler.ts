import type { DomainEventNames, DomainEvents } from '../domain-events/domain-events';
import type { EventHandler } from '@agnoc/toolkit';

/** Base class for domain event handlers. */
export abstract class DomainEventHandler implements EventHandler {
  /** The name of the event to listen to. */
  abstract eventName: DomainEventNames;

  /** Handle the event. */
  abstract handle(event: DomainEvents[this['eventName']]): void;
}
