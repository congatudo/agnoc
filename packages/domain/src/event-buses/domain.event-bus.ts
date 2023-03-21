import { EventBus, debug } from '@agnoc/toolkit';
import type { DomainEventNames, DomainEvents } from '../domain-events/domain-events';

export type DomainEventBusEvents = { [Name in DomainEventNames]: DomainEvents[Name] };
export class DomainEventBus extends EventBus<DomainEventBusEvents> {
  constructor() {
    /* istanbul ignore next */
    super({
      debug: {
        enabled: true,
        name: DomainEventBus.name,
        logger: (type, _, eventName, eventData) => {
          debug(__filename).extend(type)(
            `event '${eventName?.toString() ?? 'undefined'}' with data: ${JSON.stringify(eventData)}`,
          );
        },
      },
    });
  }
}
