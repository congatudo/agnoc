import { DomainEvent } from '@agnoc/toolkit';
import type { DomainEventProps } from '@agnoc/toolkit';

export class DeviceCreatedDomainEvent extends DomainEvent<DomainEventProps> {
  protected validate(_: DomainEventProps): void {
    // noop
  }
}
