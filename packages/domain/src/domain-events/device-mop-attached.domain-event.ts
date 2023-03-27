import { DomainEvent } from '@agnoc/toolkit';
import type { DomainEventProps } from '@agnoc/toolkit';

export interface DeviceMopAttachedDomainEventProps extends DomainEventProps {
  isAttached: boolean;
}

export class DeviceMopAttachedDomainEvent extends DomainEvent<DeviceMopAttachedDomainEventProps> {
  get isAttached(): boolean {
    return this.props.isAttached;
  }

  protected validate(props: DeviceMopAttachedDomainEventProps): void {
    this.validateDefinedProp(props, 'isAttached');
    this.validateTypeProp(props, 'isAttached', 'boolean');
  }
}
