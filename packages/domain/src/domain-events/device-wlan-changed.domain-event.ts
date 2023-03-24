import { DomainEvent } from '@agnoc/toolkit';
import { DeviceWlan } from '../value-objects/device-wlan.value-object';
import type { DomainEventProps } from '@agnoc/toolkit';

export interface DeviceWlanChangedDomainEventProps extends DomainEventProps {
  previousWlan?: DeviceWlan;
  currentWlan: DeviceWlan;
}

export class DeviceWlanChangedDomainEvent extends DomainEvent<DeviceWlanChangedDomainEventProps> {
  get previousWlan(): DeviceWlan | undefined {
    return this.props.previousWlan;
  }

  get currentWlan(): DeviceWlan {
    return this.props.currentWlan;
  }

  protected validate(props: DeviceWlanChangedDomainEventProps): void {
    if (props.previousWlan) {
      this.validateInstanceProp(props, 'previousWlan', DeviceWlan);
    }

    this.validateDefinedProp(props, 'currentWlan');
    this.validateInstanceProp(props, 'currentWlan', DeviceWlan);
  }
}
