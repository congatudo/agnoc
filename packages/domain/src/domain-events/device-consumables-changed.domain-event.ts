import { DomainEvent } from '@agnoc/toolkit';
import { DeviceConsumable } from '../value-objects/device-consumable.value-object';
import type { DomainEventProps } from '@agnoc/toolkit';

export interface DeviceConsumablesChangedDomainEventProps extends DomainEventProps {
  previousConsumables?: DeviceConsumable[];
  currentConsumables: DeviceConsumable[];
}

export class DeviceConsumablesChangedDomainEvent extends DomainEvent<DeviceConsumablesChangedDomainEventProps> {
  get previousConsumables(): DeviceConsumable[] | undefined {
    return this.props.previousConsumables;
  }

  get currentConsumables(): DeviceConsumable[] {
    return this.props.currentConsumables;
  }

  protected validate(props: DeviceConsumablesChangedDomainEventProps): void {
    if (props.previousConsumables) {
      this.validateArrayProp(props, 'previousConsumables', DeviceConsumable);
    }

    this.validateDefinedProp(props, 'currentConsumables');
    this.validateArrayProp(props, 'currentConsumables', DeviceConsumable);
  }
}
