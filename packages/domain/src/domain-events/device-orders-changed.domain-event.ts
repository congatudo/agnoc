import { DomainEvent } from '@agnoc/toolkit';
import { DeviceOrder } from '../entities/device-order.entity';
import type { DomainEventProps } from '@agnoc/toolkit';

export interface DeviceOrdersChangedDomainEventProps extends DomainEventProps {
  previousOrders?: DeviceOrder[];
  currentOrders: DeviceOrder[];
}

export class DeviceOrdersChangedDomainEvent extends DomainEvent<DeviceOrdersChangedDomainEventProps> {
  get previousOrders(): DeviceOrder[] | undefined {
    return this.props.previousOrders;
  }

  get currentOrders(): DeviceOrder[] {
    return this.props.currentOrders;
  }

  protected validate(props: DeviceOrdersChangedDomainEventProps): void {
    if (props.previousOrders) {
      this.validateArrayProp(props, 'previousOrders', DeviceOrder);
    }

    this.validateDefinedProp(props, 'currentOrders');
    this.validateArrayProp(props, 'currentOrders', DeviceOrder);
  }
}
