import { DomainEvent } from '@agnoc/toolkit';
import { DeviceNetwork } from '../value-objects/device-network.value-object';
import type { DomainEventProps } from '@agnoc/toolkit';

export interface DeviceNetworkChangedDomainEventProps extends DomainEventProps {
  previousNetwork?: DeviceNetwork;
  currentNetwork: DeviceNetwork;
}

export class DeviceNetworkChangedDomainEvent extends DomainEvent<DeviceNetworkChangedDomainEventProps> {
  get previousNetwork(): DeviceNetwork | undefined {
    return this.props.previousNetwork;
  }

  get currentNetwork(): DeviceNetwork {
    return this.props.currentNetwork;
  }

  protected validate(props: DeviceNetworkChangedDomainEventProps): void {
    if (props.previousNetwork) {
      this.validateInstanceProp(props, 'previousNetwork', DeviceNetwork);
    }

    this.validateDefinedProp(props, 'currentNetwork');
    this.validateInstanceProp(props, 'currentNetwork', DeviceNetwork);
  }
}
