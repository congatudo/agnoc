import { DomainEvent } from '@agnoc/toolkit';
import type { DomainEventProps, ID } from '@agnoc/toolkit';

export interface ConnectionDeviceChangedDomainEventProps extends DomainEventProps {
  previousDeviceId?: ID;
  currentDeviceId?: ID;
}

export class ConnectionDeviceChangedDomainEvent extends DomainEvent<ConnectionDeviceChangedDomainEventProps> {
  get previousDeviceId(): ID | undefined {
    return this.props.previousDeviceId;
  }

  get currentDeviceId(): ID | undefined {
    return this.props.currentDeviceId;
  }

  protected validate(): void {
    // noop
  }
}
