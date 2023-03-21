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
      this.domainEvents.map(async (event) => {
        this.debug(`publishing domain event '${event.constructor.name}' with data: ${JSON.stringify(event)}`);
        return eventBus.emit(event.constructor.name, event);
      }),
    );

    this.clearEvents();
  }

  protected addEvent(domainEvent: DomainEvent): void {
    this.#domainEvents.add(domainEvent);
  }
}
