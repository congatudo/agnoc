import { DomainEvent } from '@agnoc/toolkit';
import type { DomainEventProps } from '@agnoc/toolkit';

export class DeviceConnectedDomainEvent extends DomainEvent<DomainEventProps> {
  protected validate(_: DomainEventProps): void {
    // noop
  }
}
