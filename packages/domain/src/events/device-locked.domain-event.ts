import { DomainEvent } from '@agnoc/toolkit';
import type { DomainEventProps } from '@agnoc/toolkit';

export class DeviceLockedDomainEvent extends DomainEvent<DomainEventProps> {
  protected validate(_: DeviceLockedDomainEvent): void {
    // noop
  }
}
