import { debug } from '../utils/debug.util';
import { toDashCase } from '../utils/to-dash-case.util';
import { Entity } from './entity.base';
import type { DomainEvent } from './domain-event.base';
import type { EntityProps } from './entity.base';
import type { EventBus } from './event-bus.base';

export abstract class AggregateRoot<T extends EntityProps = EntityProps> extends Entity<T> {
  private readonly debug = debug(__filename).extend(toDashCase(this.constructor.name)).extend(this.id.toString());
  readonly #domainEvents = new Set<DomainEvent>();

  get domainEvents(): DomainEvent[] {
    return [...this.#domainEvents.values()];
  }

  clearEvents(): void {
    this.#domainEvents.clear();
  }

  async publishEvents(eventBus: EventBus): Promise<void> {
    await Promise.all(
      this.domainEvents.map(async (domainEvent) => {
        this.debug(
          `publishing domain event '${domainEvent.constructor.name}' with data: ${JSON.stringify(domainEvent)}`,
        );
        return eventBus.emit(domainEvent.constructor.name, domainEvent);
      }),
    );

    this.clearEvents();
  }

  protected addEvent(domainEvent: DomainEvent): void {
    this.debug(`adding domain event '${domainEvent.constructor.name}' with data: ${JSON.stringify(domainEvent)}`);
    this.#domainEvents.add(domainEvent);
  }
}
