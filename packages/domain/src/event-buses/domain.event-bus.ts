import { EventBus } from '@agnoc/toolkit';
import type { DomainEventNames, DomainEvents } from '../domain-events/domain-events';

export type DomainEventBusEvents = { [Name in DomainEventNames]: DomainEvents[Name] };
export class DomainEventBus extends EventBus<DomainEventBusEvents> {}
