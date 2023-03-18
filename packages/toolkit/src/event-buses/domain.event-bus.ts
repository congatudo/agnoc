import { EventBus } from '../base-classes/event-bus.base';
import type { DomainEvent } from '../base-classes/domain-event.base';

type DomainEvents = { [key: string]: DomainEvent };

export class DomainEventBus extends EventBus<DomainEvents> {}
