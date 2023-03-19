import { debug } from '../utils/debug.util';
import { Entity } from './entity.base';
import type { DomainEvent } from './domain-event.base';
import type { EntityProps } from './entity.base';
import type { EventBus } from './event-bus.base';

export abstract class AggregateRoot<T extends EntityProps = EntityProps> extends Entity<T> {
  private readonly debug = debug(__filename).extend(`${this.constructor.name.toLowerCase()}:${this.id.value}`);
  readonly #domainEvents = new Set<DomainEvent>();

  get domainEvents(): DomainEvent[] {
    return [...this.#domainEvents.values()];
  }

  clearEvents(): void {
    this.#domainEvents.clear();
  }

  async publishEvents(eventBus: EventBus): Promise<void> {
    await Promise.all(
      this.domainEvents.map(async (event) => {
        this.debug(`publishing domain event '${event.constructor.name}'`);
        return eventBus.emit(event.constructor.name, event);
      }),
    );

    this.clearEvents();
  }

  protected addEvent(domainEvent: DomainEvent): void {
    this.#domainEvents.add(domainEvent);
  }
}
