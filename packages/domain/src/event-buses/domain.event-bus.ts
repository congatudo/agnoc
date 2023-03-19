import { EventBus } from '@agnoc/toolkit';
import type { DomainEventNames, DomainEvents } from '../domain-events/domain-events';

type DomainEventBusEvents = { [Name in DomainEventNames]: DomainEvents[Name] };

export class DomainEventBus extends EventBus<DomainEventBusEvents> {}
