import { DomainEvent } from '@agnoc/toolkit';
import type { DomainEventProps } from '@agnoc/toolkit';

export interface DeviceMapPendingDomainEventProps extends DomainEventProps {
  isPending: boolean;
}

export class DeviceMapPendingDomainEvent extends DomainEvent<DeviceMapPendingDomainEventProps> {
  get isPending(): boolean {
    return this.props.isPending;
  }

  protected validate(props: DeviceMapPendingDomainEventProps): void {
    this.validateDefinedProp(props, 'isPending');
    this.validateTypeProp(props, 'isPending', 'boolean');
  }
}
