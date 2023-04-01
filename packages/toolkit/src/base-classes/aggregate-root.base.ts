import { debug } from '../utils/debug.util';
import { toDashCase } from '../utils/to-dash-case.util';
import { Entity } from './entity.base';
import type { DomainEvent } from './domain-event.base';
import type { EntityProps } from './entity.base';
import type { EventBus } from './event-bus.base';

/** Base class for aggregate roots. */
export abstract class AggregateRoot<T extends EntityProps = EntityProps> extends Entity<T> {
  private readonly debug = debug(__filename).extend(toDashCase(this.constructor.name)).extend(this.id.toString());
  readonly #domainEvents = new Set<DomainEvent>();

  /** Returns the domain events that have been added to the aggregate root. */
  get domainEvents(): DomainEvent[] {
    return [...this.#domainEvents.values()];
  }

  /** Clears the domain events that have been added to the aggregate root. */
  clearEvents(): void {
    this.#domainEvents.clear();
  }

  /** Publishes the domain events that have been added to the aggregate root and clears them. */
  async publishEvents(eventBus: EventBus): Promise<void> {
    const domainEvents = this.domainEvents;

    this.clearEvents();

    await Promise.all(
      domainEvents.map(async (domainEvent) => {
        this.debug(
          `publishing domain event '${domainEvent.constructor.name}' with data: ${JSON.stringify(domainEvent)}`,
        );
        return eventBus.emit(domainEvent.constructor.name, domainEvent);
      }),
    );
  }

  protected addEvent(domainEvent: DomainEvent): void {
    this.#domainEvents.add(domainEvent);
  }
}
