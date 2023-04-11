import { DomainEvent, ID } from '@agnoc/toolkit';
import type { DomainEventProps } from '@agnoc/toolkit';

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

  protected validate(props: ConnectionDeviceChangedDomainEventProps): void {
    if (props.previousDeviceId) {
      this.validateInstanceProp(props, 'previousDeviceId', ID);
    }

    if (props.currentDeviceId) {
      this.validateInstanceProp(props, 'currentDeviceId', ID);
    }
  }
}
